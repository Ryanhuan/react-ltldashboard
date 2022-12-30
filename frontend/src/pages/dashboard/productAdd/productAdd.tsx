import { Component, createRef } from "react";
import styles from "./productAdd.module.scss";
import { Product } from "@/components/dashboard/product/Product";

export class productAdd extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
    };

    this.setLoading = this.setLoading.bind(this);
  }

  setLoading(state: boolean) {
    this.props.setLoading(state);
  }

  render() {
    return (
      <div className={styles.productAdd}>
        {/* wrapper */}
        <div className={styles.wrapper}>
          <Product
            type={'add'}
            setLoading={(state: boolean) => this.setLoading(state)}
          />
        </div>
        {/* wrapper end */}
      </div>
    );
  }
}
