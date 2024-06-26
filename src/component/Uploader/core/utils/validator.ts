import { Policy } from "../types";
import { FileValidateError } from "../errors";

interface Validator {
    (file: File, policy: Policy): void;
}

// validators
const checkers: Array<Validator> = [
    function checkExt(file: File, policy: Policy) {
        if (
            policy.allowedSuffix != undefined &&
            policy.allowedSuffix.length > 0
        ) {
            const ext = file?.name.split(".").pop();
            //if (ext === null || !ext || !policy.allowedSuffix.includes(ext))
            // 判断文件后缀扩展名是否在白名单中, 如果不在白名单中则抛出错误,不区分大小写
            if (ext === null || !ext || !policy.allowedSuffix.some((s) => s.toLowerCase() === ext.toLowerCase()))
                throw new FileValidateError(
                    "File suffix not allowed in policy.",
                    "suffix",
                    policy
                );
        }
    },

    function checkSize(file: File, policy: Policy) {
        if (policy.maxSize > 0) {
            if (file.size > policy.maxSize) {
                throw new FileValidateError(
                    "File size exceeds maximum limit.",
                    "size",
                    policy
                );
            }
        }
    },
];

/* 将每个 Validator 执行
   失败返回 Error
 */
export function validate(file: File, policy: Policy) {
    checkers.forEach((c) => c(file, policy));
}
