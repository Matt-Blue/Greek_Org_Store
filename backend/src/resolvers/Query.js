const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');
const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
        //check if there is a current user ID 
        if (!ctx.request.userId) {
            return null;
        } 
        return ctx.db.query.user({
            where: {id: ctx.request.userId},
        }, 
        info );
    },
    async users(parent, args, ctx, info) {
        //1. check if logged in
        if (!ctx.request.userId) {
            throw new Error ('You are not logged in');
        }
        //2. check if user has permissions to check permissions
        hasPermission(ctx.request.user, ['ADMIN','PERMISSIONUPDATE']);
        //3. if so, check all users 
        // console.log(ctx.db.query.users({},info));
        return ctx.db.query.users({},info);
    },
    async order(parent, args, ctx, info) {
        //1. check if logged in 
        if (!ctx.request.userId) {
            throw new Error ('You are not logged in.'); 
        }
        //2. query curr order
        const order = await ctx.db.query.order({
            where: {id: args.id},
        }, info);
        //3. check permissions to see order 
        const ownsOrder = order.user.id === ctx.request.userId;
        const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');
        if(!ownsOrder || !hasPermission) {
            throw new Error ('You cannot see this.');
        }
        //4. return order 
        return order;
    },
    async orders(parent, args, ctx, info) {
        const {userId} = ctx.request; 
        if(!userId){
            throw new Error ('You must be signed in.');
        }
        return ctx.db.query.orders({
            where: {
                user: {id: userId}
            }
        }, info);
    },
    // async isAdmin(parent,args,ctx,info) {
    //     const {userId} = ctx.request;
    //     console.log(process.env.ADMIN_EMAIL);
    //     console.log(userId.email);
    //     if (!(userId.email === process.env.ADMIN_EMAIL)){
    //         return false;
    //     }
    //     else {
    //         return true; 
    //     } 
    // },
};

module.exports = Query;
