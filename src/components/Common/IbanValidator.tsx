import * as ibantools from "ibantools";

export type IbanErrorState = {
  message: string;
  status: boolean;
};

export const ibanValidator = (
  accountType: string,
  setIbanError: (val: IbanErrorState) => void
) => {
  return (_: any, value: string | null | undefined) => {
    if (accountType === "IBAN") {
      const ibanValue = value ?? "";

      if (!ibanValue) {
        setIbanError({ message: "", status: false });
        return Promise.resolve();
      }

      if (!/^[a-zA-Z0-9]*$/.test(ibanValue)) {
        setIbanError({ message: "", status: false });
        return Promise.resolve();
      }

      const rawIban = ibantools.electronicFormatIBAN(String(ibanValue));
      const iban: string = rawIban ?? "";

      if (!ibantools.isValidIBAN(iban)) {
        setIbanError({ message: "Enter valid IBAN", status: true });
        return Promise.reject("Enter valid IBAN");
      }
      setIbanError({ message: "", status: false });
    }
    return Promise.resolve();
  };
};
