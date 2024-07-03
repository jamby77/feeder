import { cva, type VariantProps } from "class-variance-authority";
import { Input } from "@/components/ui/input";
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
  value?: string | number | undefined;
  name?: string;
  label?: string;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  readonly?: boolean;
  labelSuffix?: string;
  className?: string;
}

export const FormInputGroup = ({
  label,
  value,
  id,
  name,
  variant = "default",
  required = false,
  type = "text",
  readonly = false,
  disabled = false,
  className,
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
          {required ? " *" : ""}
          {labelSuffix}
        </Label>
      )}
      <Input
        required={required}
        type={type}
        id={id}
        name={name ?? id}
        defaultValue={value}
        readOnly={readonly}
        disabled={disabled}
        className={cn({ "cursor-not-allowed select-none": disabled || readonly })}
      />
    </div>
  );
};

export default FormInputGroup;
