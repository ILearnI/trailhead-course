import styles from "./Badge.module.css";

/**
 * A small label.
 * variant: "neutral", "success" or "warning"
 */
export default function Badge({ variant = "neutral", children }) {
  return <span className={styles[variant]}>{children}</span>;
}
