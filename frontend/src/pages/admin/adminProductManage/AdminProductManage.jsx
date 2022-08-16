
import './adminProductManage.css'
import { Component } from 'react'


export class AdminProductManage extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // this.handleDataChange = this.handleDataChange.bind(this);
    }


    render() {
        return (
            <div className="adminProductManage">
                <div className="adminProductManageWrapper">
                    <div className="adminMatManageBody">
                        <div className="adminMatManageItem">
                            <a href="/#" className="itemTitle" name="insertWrapper" onClick={this.WrapperOpen}>材料新增</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
