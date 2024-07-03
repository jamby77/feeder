import { ReactNode } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const groupVariants = cva("flex justify-start gap-2", {
  variants: {
    variant: {
      default: "flex-row items-center",
      vertical: "flex-col items-start",
    },
    size: {
      full: "w-full",
      half: "w-1/2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "full",
  },
});
interface FormGroupProps extends VariantProps<typeof groupVariants> {
  id: string;
  label?: string;
  required?: boolean;
  className?: string;
  labelSuffix?: string;
  children: ReactNode;
}
export const FormSelectGroup = ({
  label,
  id,
  children,
  className,
  variant = "default",
  required = false,
  labelSuffix = ":",
}: FormGroupProps) => {
  return (
    <div
      className={cn(
        groupVariants({
          variant,
          className,
        }),
      )}
      title={label}
    >
      {label && (
        <Label htmlFor={id} className="flex-shrink-0 flex-grow-0">
          {label}
          {required ? " *:" : ":"}
          {labelSuffix}
        </Label>
      )}
      {children}
    </div>
  );
};

export default FormSelectGroup;
