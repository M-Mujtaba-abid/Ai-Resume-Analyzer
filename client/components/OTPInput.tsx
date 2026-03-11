import { VerifyOtpRequest } from "@/types/authTypes";
import { useRef, useEffect } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface OTPInputProps {
  register: UseFormRegister<VerifyOtpRequest>;
  setValue: UseFormSetValue<VerifyOtpRequest>;
}

export default function OTPInput({ register, setValue }: OTPInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return; // only digits

    if (val && index < 5) {
      inputs.current[index + 1]?.focus(); // null safe
    }

    updateOTP();
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputs.current[index - 1]?.focus(); // null safe
    }

    updateOTP();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("Text").slice(0, 6);
    paste.split("").forEach((v, i) => {
      if (inputs.current[i]) inputs.current[i]!.value = v; // null check
    });
    updateOTP();
    const nextIndex = paste.length < 6 ? paste.length : 5;
    inputs.current[nextIndex]?.focus(); // null safe
  };

  const updateOTP = () => {
    const otp = inputs.current.map((input) => input?.value || "").join(""); // null safe
    setValue("otp", otp);
  };

  useEffect(() => {
    inputs.current[0]?.focus(); // null safe
  }, []);

  return (
    <div className="flex justify-center gap-3">
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          className="w-12 h-14 border border-border bg-background text-foreground rounded-lg text-center text-2xl font-mono focus:ring-2 focus:ring-green-500 outline-none"
          ref={(el) => { inputs.current[i] = el; }} // null safe
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleBackspace(e, i)}
          onPaste={handlePaste} // paste support
        />
      ))}

      {/* hidden input for React Hook Form */}
      <input type="hidden" {...register("otp")} />
    </div>
  );
}