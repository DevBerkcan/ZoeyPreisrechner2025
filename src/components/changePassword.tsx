import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import ChangePasswordForm from "./changePasswordForm";

const ChangePassword = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center gap-2 px-4 py-1 rounded-md border border-solid border-main-color text-sm text-main-color hover:bg-gray-100">
          <Image
            src="/assets/pencil-line.png"
            alt="edit icon"
            width={25}
            height={27}
            className="object-contain"
          />
          Passwort ändern
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Your Password</DialogTitle>
          <DialogDescription>
            To secure your account, please provide your current password and set
            a new one.
          </DialogDescription>
        </DialogHeader>
        <ChangePasswordForm />
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
