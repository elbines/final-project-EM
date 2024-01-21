import React from 'react';
// import styled from 'styled-components';
import { Text } from '../UI/Typography';
import styles from './Disclaimer.module.css';

export const Disclaimer = ({ onAccept }) => {
    return (
        <div className={styles.disclaimer}>
            <Text type="H1" className={styles.h1}>
                ARE YOU OF LEGAL DRINKING AGE IN YOUR COUNTRY?
            </Text>
            <Text type="H1" className={styles.h1}> Please confirm to enter this site.
            </Text>
            <div className={styles.buttons}>
                <button onClick={() => onAccept(true)} className={styles.btnYes}><Text type="H1" className={styles.h1Btn}> Yes
                </Text></button>
                <button onClick={() => onAccept(false)} className={styles.btnNo}><Text type="H1" className={styles.h1Btn}> No
                </Text></button>
            </div>
        </div >
    );
};
