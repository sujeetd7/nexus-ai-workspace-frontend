export { Button } from "./Button.web";

// import type { CSSProperties } from "react";

// import { buttonStyles } from "./Button.styles";
// import type { ButtonProps } from "./Button.types";

// export function Button({
//   children,
//   loading = false,
//   disabled,
//   fullWidth = false,
//   leftIcon,
//   rightIcon,
//   style,
//   ...props
// }: ButtonProps) {
//   const styles: CSSProperties = {
//     ...buttonStyles.base,
//     width: fullWidth ? "100%" : undefined,
//     ...(style as CSSProperties),
//   };

//   return (
//     <button {...props} disabled={loading || disabled} style={styles}>
//       {loading ? (
//         "Loading..."
//       ) : (
//         <>
//           {leftIcon}
//           {children}
//           {rightIcon}
//         </>
//       )}
//     </button>
//   );
// }
