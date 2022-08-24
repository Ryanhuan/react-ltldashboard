import { postData } from "./api";

export async function getSelectOption(type: string) {
    let _SelectOption = [{ value: '', label: '==請選擇==' },];
    let _res = await postData("/api/getCodeTypeKind/" + type);
    if (_res.msg === "getCodeTypeKind_OK") {
        _res.data.forEach((ele:any) => {
            _SelectOption.push(ele);
        })
    }
    // setSelectOption(_SelectOption);
    return _SelectOption;
}
