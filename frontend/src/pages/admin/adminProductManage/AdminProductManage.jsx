
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
            <div className="AdminProductManage">
                <div className="AdminProductManageWrapper">
                    <div className="AdminProductManageTop">
                        <span className="PageTitle">產品管理</span>
                    </div>

                    <div className="AdminMatManageBody">
                        <div className="AdminMatManageItem">
                            <div className="AdminMatManageItemTitle">
                                <a href="/#" className="AdminMatManageItemTitle" name="insertWrapper" onClick={this.WrapperOpen}>材料新增</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
