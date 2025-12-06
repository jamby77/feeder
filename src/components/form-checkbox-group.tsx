import { cva, VariantProps } from "class-variance-authority";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const groupVariants = cva("flex justify-start gap-2", {
  variants: {
    variant: {
      default: "flex-row items-center",
      vertical: "flex-col items-start",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
interface FormGroupProps extends VariantProps<typeof groupVariants> {
  id: string;
  checked?: boolean | number | undefined;
  name?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelSuffix?: string;
}
export const FormCheckboxGroup = ({
  label,
  checked,
  id,
  name,
  className,
  variant = "default",
  required = false,
  disabled = false,
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
        <Label htmlFor={id} className="shrink-0 grow-0">
          {label}
          {required ? " *" : ""}
          {labelSuffix}
        </Label>
      )}
      <Checkbox required={required} id={id} name={name ?? id} defaultChecked={!!checked} disabled={disabled} />
    </div>
  );
};

export default FormCheckboxGroup;
