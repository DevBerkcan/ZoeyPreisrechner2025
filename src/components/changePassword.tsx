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
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-main-color text-sm text-main-color hover:bg-main-color/10 transition-colors">
          <Image
            src="/assets/pencil-line.png"
            alt="edit icon"
            width={18}
            height={18}
            className="object-contain"
          />
          <span className="hidden sm:inline">Passwort</span>
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
