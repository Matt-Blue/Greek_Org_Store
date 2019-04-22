import React, {Component} from 'react'

class Pagination extends Component{
    render(){
        return(
            <div>
                <div className="pagination row">
                    <div className="col-sm">
                        <button className="btn btn-dark" onClick={this.props.pageDown}>Back</button>
                    </div>
                    <div className="col-sm">
                        <div className="page">{` `}Page {this.props.page} of {this.props.numPages}{` `}</div>
                    </div>
                    <div className="col-sm">
                        <button className="btn btn-dark" onClick={this.props.pageUp}>Forward</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Pagination