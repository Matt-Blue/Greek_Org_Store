const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail} = require('../mail');
const { hasPermission } = require('../utils');
const stripe = require('../stripe');

const Mutations = {
    async createItem(parent, args, ctx, info){
        // check if they're logged in 
        if (!ctx.request.userId){
            throw new Error ('You must be logged in to do that.');
        }
        const item = await ctx.db.mutation.createItem({
            data: {
                // this is how we create relationship between item and user 
                user: {
                    connect: {
                        id: ctx.request.userId,
                    }
                },
                ...args,
            }
        }, info);

        console.log(item);
        
        return item;
    },

    updateItem(parent, args, ctx, info){
        // take copy of updates
        const updates = {...args};
        // remove ID from update
        delete updates.id;
        // run updatem method 
        return ctx.db.mutation.updateItem(
            {
                data: updates,
                where: {
                    id: args.id,
                },
            }, 
            info
        );

    },

    async deleteItem(parent,args, ctx, info){
        // throw new Error ('You aren\'t allowed to delete');
        const where = {id: args.id};
        // find item 
        const item = await ctx.db.query.item({ where }, `{ id title user {id}}`);
        // check if user owns item TODO
        const ownsItem = item.user.id === ctx.request.userId;
        const hasPermissions = ctx.request.user.permissions.some(permission => ['ADMIN','ITEMDELETE'].includes(permission));

        if (!(ownsItem && hasPermissions)) {
            throw new Error('You do not have permission to do this.');
        }
        // delete 

        return ctx.db.mutation.deleteItem({ where }, info);
    },
    async signup(parent,args, ctx, info){
        //lowers all emails 
        args.email = args.email.toLowerCase();
        //hash password 
        const password = await bcrypt.hash(args.password, 10);
        //create user in db 
        const user = await ctx.db.mutation.createUser(
            {
                data: {
                    ...args,
                    password,
                    permissions: { set: ['USER'] },
                },                    
            }, 
            info
        );
        //create JWT token 
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
        //set JWT as cookie on response 
        ctx.response.cookie('token',token,{
            httpOnly: true, 
            maxAge: 1000 * 60 * 60 * 24 * 7, //one week cookie
        });
        // return user to browser 
        return user; 
    },
    async signin(parent,{email, password}, ctx, info) {
        // 1) check if user with email
        const user = await ctx.db.query.user({where : {email: email}});
        if (!user) {
            throw new Error (`Invalid password or email`);
        }
        // 2) check pass
        const valid = await bcrypt.compare(password,user.password);
        if (!valid){
            throw new Error(`Invalid password or email`);
        } 
        // 3) generate JWT token 
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
        // 4) set cookie with token 
        ctx.response.cookie('token',token,{
            httpOnly: true, 
            maxAge: 1000 * 60 * 60 * 24 * 7, //one week cookie
        });
        // 5) return user  
        return user; 
    },
    signout (parent,args, ctx, info) { 
        ctx.response.clearCookie('token');
        return { message : 'Goodbye!'};
    },
    async requestReset (parent,args, ctx, info) { 
        // 1. check if real user
        const user = await ctx.db.query.user({ where: {email : args.email }});
        if (!user){
            throw new Error ('No user with that email exists');
        }  
        // 2. set reset token and expiry 
        const randomBytesPromiseified = promisify(randomBytes);
        const resetToken = (await randomBytesPromiseified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        const res = await ctx.db.mutation.updateUser({
        where: { email: args.email },
        data: { resetToken, resetTokenExpiry },
        });
        // console.log(res);
        console.log("Sent reset to email")
        // 3. email reset token
        const mailRes = await transport.sendMail({
            from: 'achabab97@ufl.edu',
            to: user.email,
            subject: 'password reset token',
            html: makeANiceEmail(`your password reset token is here!
            \n\n 
            <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset</a>`),
        });

        // 4. return message 
        return {message: 'generalkenobi'};
    },
    async resetPassword(parent,args, ctx, info) {
        //1. check if passwords match
        if(args.password!==args.confirmPassword) {
            throw new Error (`Passwords do not match!`);
        }
        //2. check if it's a legit reset token 
        //3. check if its expired
        const [user] = await ctx.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000,
            }
        });
        if (!user)  {
            throw new Error ('This token is either invalid or expired.');
        }
        //4. hash new password 
        const password = await bcrypt.hash(args.password,10);
        //5. save new password to user and remove old resetToken field
        const updatedUser = await ctx.db.mutation.updateUser({
            where: { email: user.email },
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        //6. generate JWT 
        const token = jwt.sign({userId: updatedUser.id},process.env.APP_SECRET);
        //7. set JWT cookie 
        ctx.response.cookie('token',token,{
            httpOnly: true, 
            maxAge: 1000 * 60 * 60 * 24 * 7, //one week cookie
        });
        //8. return new user  
        return updatedUser;
    }, 
    async updatePermissions(parent,args,ctx,info) {
        //1. check if logged in
        if (!ctx.request.userId) {
            throw new Error ('You must be logged in');
        }
        //2. query curr user
        const currentUser = await ctx.db.query.user({
            where: {
                id: ctx.request.userId,
            },
        }, info);
        //3. check permissions
        hasPermission(currentUser, ['ADMIN','PERMISSIONUPDATE']); 
        //4. update permissions 
        return ctx.db.mutation.updateUser({
            data: {
                permissions: {
                    set: args.permissions,
                },
            },
            where: {
                id: args.userId,
            },
        }, info);
    },
    async addToCart(parent,args,ctx,info){
        //1. check if signed in
        const {userId} = ctx.request;
        if (!userId) {
            throw new Error ('You must be signed in.');
        }
        //2. query user's current cart 
        const [existingCartItem] = await ctx.db.query.cartItems({
            where: { 
                user: { id: userId},
                item: { id: args.id},
            }
        })
        //3. check if item is already in cart, if so inc by 1 
        if (existingCartItem) {
            console.log('Item already in cart');
            return ctx.db.mutation.updateCartItem({
                where: { id: existingCartItem.id},
                data: {quantity: existingCartItem.quantity+1},
            }, info);
        }
        //4. if not, create fresh cart item for user 
        return ctx.db.mutation.createCartItem({
            data: {
                user: {
                    connect: {id: userId},
                },
                item: {
                    connect: {id: args.id},
                } 
            }
        }, info)
    },
    async removeFromCart(parent,args,ctx,info) {
        //1. find cart item 
        const cartItem = await ctx.db.query.cartItem({
            where: {
                id: args.id,
            },
        }, `{id, user {id}}`);
        //1.5 make sure we found item 
        if (!cartItem) throw new Error ('No cart item found.'); 
        //2. make sure they own the cart
        if (cartItem.user.id !== ctx.request.userId) {
            throw new Error ('You do not own this cart');
        }
        //3. delete cart item 
        return ctx.db.mutation.deleteCartItem({
            where: {id: args.id},

        }, info);
    }, 
    async createOrder(parent,args,ctx,info) {
        //1. query curr user and make sure they are signed in
        const { userId } = ctx.request;
        if (!userId ) throw new Error("Must be signed in to complete order."); 
        const user = await ctx.db.query.user({where: {id: userId}},`
        {
            id 
            name 
            email 
            inOrg
            organization
            cart { 
                id 
                quantity 
                item {
                    title 
                    Price 
                    id 
                    description 
                    image
                    largeImage
                }
            }
        }`);
        //2. recalculate total 
        const amount = user.cart.reduce(
            (tally, cartItem ) => tally + cartItem.item.Price * cartItem.quantity, 0);
        console.log(`charging total of ${amount}`); 
        //3. create stripe charge (turn token into money)
        const charge = await stripe.charges.create({
           amount, 
           currency: 'USD',
           source: args.token, 
        });
        //4. convert cart items to order items 
        const orderItems = user.cart.map(cartItem => {
            const orderItem = {
                ...cartItem.item,
                quantity: cartItem.quantity,
                user: { connect: {id:userId}},

            };
            delete orderItem.id;
            return orderItem;
        });
        //5. create order 
        const order = await ctx.db.mutation.createOrder({
            data: {
                total: charge.amount,
                charge: charge.id,
                items: { create: orderItems},
                user: { connect: { id: userId }},
            },
        });
        //6. clear cart and delete cart items 
        const cartItemIds = user.cart.map(cartItem => cartItem.id);
        await ctx.db.mutation.deleteManyCartItems({ 
            where: {
                id_in: cartItemIds,
            },
        });
        //7. return order to client
        return order;  
    },
};

module.exports = Mutations;
