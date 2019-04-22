import React, {Component} from 'react'

class GridExample extends Component{
    render(){
        return(
            <div>
                <div className="title push-down">Grid System Example</div>
                <div className="row">
                    <div className="section col-sm">1</div>
                </div>                
                <div className="row">
                    <div className="section col-sm">1</div>
                    <div className="section col-sm">2</div>
                </div>                
                <div className="row">
                    <div className="section col-sm">1</div>
                    <div className="section col-sm">2</div>
                    <div className="section col-sm">3</div>
                    <div className="section col-sm">4</div>
                </div>
                <div className="row">
                    <div className="section col-sm">1</div>
                    <div className="section col-sm">2</div>
                    <div className="section col-sm">3</div>
                    <div className="section col-sm">4</div>
                    <div className="section col-sm">5</div>
                    <div className="section col-sm">6</div>
                </div>
                <div className="row">
                    <div className="section col-sm">1</div>
                    <div className="section col-sm">2</div>
                    <div className="section col-sm">3</div>
                    <div className="section col-sm">4</div>
                    <div className="section col-sm">5</div>
                    <div className="section col-sm">6</div>
                    <div className="section col-sm">7</div>
                    <div className="section col-sm">8</div>
                    <div className="section col-sm">9</div>
                    <div className="section col-sm">10</div>
                    <div className="section col-sm">11</div>
                    <div className="section col-sm">12</div>
                </div>
            </div>
        )
    }
}

export default GridExample