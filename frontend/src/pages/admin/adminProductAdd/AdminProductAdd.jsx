import './adminProductAdd.scss'
import { Component } from 'react'
import { Product } from '../../../components/admin/product/Product'
import { customAlert, customToastTopEnd } from '../../../components/customAlert/customAlert';

export class AdminProductAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="adminProductAdd">
                {/* adminProductAddWrapper */}
                <div className="adminWrapper">
                    <Product />
                </div>
                {/* adminProductAddWrapper end */}
            </div >
        )
    }
}
