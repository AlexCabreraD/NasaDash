import { motion } from "framer-motion";

interface FlipLinkProps {
  children: string;
  href: string;
  target: string;
  className?: string;
}

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ children, href, target, className }: FlipLinkProps) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      target={target}
      className="relative block overflow-hidden"
    >
      <div className={className}>
        {children.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
          >
            {char === " " ? (
              <span className="inline-block w-[0.3em]">&nbsp;</span>
            ) : (
              char
            )}
          </motion.span>
        ))}
      </div>

      <div className={`${className} absolute inset-0`}>
        {children.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
          >
            {char === " " ? (
              <span className="inline-block w-[0.3em]">&nbsp;</span>
            ) : (
              char
            )}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};

export default FlipLink;
