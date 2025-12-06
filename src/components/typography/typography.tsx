import { cn } from "@/lib/utils";

export interface HeadingProps extends React.InputHTMLAttributes<HTMLHeadingElement> {}

export const H1 = ({ children, className, ...rest }: HeadingProps) => {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)} {...rest}>
      {children}
    </h1>
  );
};

export const H2 = ({ children, className, ...rest }: HeadingProps) => {
  return (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
        className,
      )}
      {...rest}
    >
      {children}
    </h2>
  );
};
export const H3 = ({ children, className, ...rest }: HeadingProps) => {
  return (
    <h3 className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...rest}>
      {children}
    </h3>
  );
};
export const H4 = ({ children, className, ...rest }: HeadingProps) => {
  return (
    <h4 className={cn("mt-8 scroll-m-20 text-xl font-semibold tracking-tight", className)} {...rest}>
      {children}
    </h4>
  );
};
export interface ParagraphProps extends React.InputHTMLAttributes<HTMLParagraphElement> {}

export const P = ({ children, className, ...rest }: ParagraphProps) => {
  return (
    <p className={cn("leading-7 not-first:mt-6", className)} {...rest}>
      {children}
    </p>
  );
};

export const Lead = ({ children, className, ...rest }: ParagraphProps) => {
  return (
    <p className={cn("text-xl text-muted-foreground", className)} {...rest}>
      {children}
    </p>
  );
};

export const Large = ({ children, className, ...rest }: ParagraphProps) => {
  return (
    <p className={cn("text-lg font-semibold", className)} {...rest}>
      {children}
    </p>
  );
};

export const Small = ({ children, className, ...rest }: ParagraphProps) => {
  return (
    <p className={cn("text-sm font-medium leading-none", className)} {...rest}>
      {children}
    </p>
  );
};

export const Muted = ({ children, className, ...rest }: ParagraphProps) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...rest}>
      {children}
    </p>
  );
};
