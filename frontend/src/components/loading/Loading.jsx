import './loading.css';
import { Star } from '@material-ui/icons';

export default function Loading() {

    const ICon=Star;

    return (
        <div className="Loading">

            <img className="logoImg" src="/images/LOGO_small.png" alt="LOGO" />

            <div className="lds-default">

                <div><ICon className="IConStyle" /></div>
                <div><ICon className="IConStyle" /></div>
                <div><ICon className="IConStyle" /></div>
                <div><ICon className="IConStyle" /></div>
                <div><ICon className="IConStyle" /></div>
                <div><ICon className="IConStyle" /></div>
                <div><ICon className="IConStyle" /></div>
                <div><ICon className="IConStyle" /></div>
                <div><ICon className="IConStyle" /></div>
                <div><ICon className="IConStyle" /></div>
                <div><ICon className="IConStyle" /></div>
                <div><ICon className="IConStyle" /></div>
                {/* <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div> */}
            </div>
        </div>
    )
}
