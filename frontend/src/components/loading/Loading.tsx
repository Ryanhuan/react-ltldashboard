import styles from './loading.module.scss';
import StarIcon from '@mui/icons-material/Star';
import imgLogoSmall from '@/assets/images/LOGO_small.png'
import { useEffect } from 'react';

export default function Loading() {

    const ICon = StarIcon;

    return (
        <div className={styles.Loading}>
            <img className={styles.logoImg} src={imgLogoSmall} alt="LOGO" />
            <div className={styles.ldsDefault}>
                <div><ICon className={styles.IConStyle} /></div>
                <div><ICon className={styles.IConStyle} /></div>
                <div><ICon className={styles.IConStyle} /></div>
                <div><ICon className={styles.IConStyle} /></div>
                <div><ICon className={styles.IConStyle} /></div>
                <div><ICon className={styles.IConStyle} /></div>
                <div><ICon className={styles.IConStyle} /></div>
                <div><ICon className={styles.IConStyle} /></div>
                <div><ICon className={styles.IConStyle} /></div>
                <div><ICon className={styles.IConStyle} /></div>
                <div><ICon className={styles.IConStyle} /></div>
                <div><ICon className={styles.IConStyle} /></div>
            </div>
        </div >
    )
}
