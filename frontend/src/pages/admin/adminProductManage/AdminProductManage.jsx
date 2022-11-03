
import './adminProductManage.scss'
import { Component } from 'react'
import { customAlert } from '../../../components/customAlert/customAlert';


export class AdminProductManage extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // this.handleDataChange = this.handleDataChange.bind(this);
    }


    render() {
        return (
            <div className="adminProductManage">
                <div className="adminWrapper">
                    <div className="adminItems">
                        <div className="adminItemWrapper">
                            <a href="/#" className="itemTitle" name="insertWrapper" onClick={this.WrapperOpen}>材料新增</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
