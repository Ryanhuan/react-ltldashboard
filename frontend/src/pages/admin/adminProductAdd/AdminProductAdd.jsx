import './adminProductAdd.css'
import { Component } from 'react'
import { Product } from '../../../components/admin/product/Product'

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
                <div className="adminProductAddWrapper">
                    <Product />
                </div>
                {/* adminProductAddWrapper end */}
            </div >
        )
    }
}
