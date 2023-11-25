/* eslint-disable react/display-name */
import { motion } from 'framer-motion';

const AnimationHOC = (Component) => {
    return (props) => (
        <motion.div
            initial={{
                scale: 0,
                opacity: 0,
            }}
            animate={{
                scale: 1,
                opacity: 1,
            }}
            transition={{
                duration: 0.6,
            }}
        >
            <Component {...props} />
        </motion.div>
    );
};

export default AnimationHOC;
