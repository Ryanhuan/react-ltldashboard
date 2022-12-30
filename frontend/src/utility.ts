import { postData } from "@/api";

export async function getSelectOption(type: string) {
    let _SelectOption = [{ value: '', label: '==請選擇==' },];
    let _res = await postData("/api/codeManage/getCodeTypeKind/" + type);
    if (_res.ack === "OK") {
        _res.data.forEach((ele:any) => {
            _SelectOption.push(ele);
        })
    }
    // setSelectOption(_SelectOption);
    return _SelectOption;
}

//判斷obj是否為空
export async function checkEmpty(o) {
    return (o !== null && o !== undefined && o !== '') ? true : false;
}
