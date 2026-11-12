import { motion } from 'framer-motion';
import { Check, Globe2, ShieldCheck, Clock } from 'lucide-react';

// Animated passport illustration used on the landing hero and auth pages.
export default function PassportArt({ compact = false }) {
  const chip = (delay) => ({
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { delay, type: 'spring', stiffness: 160, damping: 16 },
  });

  return (
    <div className="passport-scene">
      <motion.div
        initial={{ rotateY: -35, rotateX: 12, opacity: 0, y: 40 }}
        animate={{ rotateY: -14, rotateX: 6, opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="passport"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="p-title">SRI LANKA</div>
          <div className="crest">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
              <Globe2 size={52} strokeWidth={1.2} />
            </motion.div>
          </div>
          <div className="p-title">PASSPORT</div>
          <div className="p-sub">ගමන් බලපත්‍රය · கடவுச்சீட்டு</div>
        </motion.div>
      </motion.div>

      <motion.div className="float-chip" style={{ top: compact ? 30 : 50, left: compact ? 0 : 10 }} {...chip(0.6)}>
        <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }} className="row">
          <span className="dot"><Check size={15} /></span> Form K 35 A ready
        </motion.span>
      </motion.div>
      <motion.div className="float-chip dark-chip" style={{ bottom: compact ? 60 : 80, left: compact ? -10 : -10 }} {...chip(0.9)}>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity }} className="row">
          <span className="dot"><ShieldCheck size={15} /></span> Official source · checked
        </motion.span>
      </motion.div>
      <motion.div className="float-chip" style={{ top: compact ? 150 : 190, right: compact ? -10 : 0 }} {...chip(1.2)}>
        <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 4.5, repeat: Infinity }} className="row">
          <span className="dot"><Clock size={15} /></span> Step 4 of 10
        </motion.span>
      </motion.div>
    </div>
  );
}
