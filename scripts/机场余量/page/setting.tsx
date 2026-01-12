import {
    Button,
    Image,
    List,
    Navigation,
    NavigationStack,
    ProgressView,
    Section,
    TextField,
    useEffect,
    useObservable,
} from "scripting";
import {api} from "../util/api";

export function View() {
    const dismiss = Navigation.useDismiss();
    return (
        <NavigationStack>
            <StackView
                navigationTitle={"设置"}
                toolbar={{
                    topBarLeading: [<Button title={"关闭"} systemImage={"xmark"} action={dismiss}/>],
                    topBarTrailing: [<SaveButton/>],
                }}
            />
        </NavigationStack>
    );
}

function SaveButton() {
    const dismiss = Navigation.useDismiss();
    const load = useObservable<boolean>(false);
    return (
        <Button
            action={async () => {
                load.setValue(true);
                const res = await api.save();
                load.setValue(false);

                if (!res) {
                    Dialog.alert({
                        title: "错误",
                        message: "获取机场信息失败",
                    });
                } else {
                    dismiss();
                }
            }}>
            {load.value ? <ProgressView/> : <Image systemName={"checkmark"}/>}
        </Button>
    );
}

function StackView() {
    return (
        <List>
            <Section title={"信息"}>
                <TitleSec/>
                <UrlSec/>
                <ResetDaySec/>
                <MethodSec/>
                <UaSec/>
            </Section>
        </List>
    );
}

function TitleSec() {
    const v = useObservable(api.title);
    useEffect(() => {
        api.title = v.value;
    }, [v.value]);
    return <TextField title={"机场名称"} value={v}/>;
}

function UrlSec() {
    const v = useObservable(api.url);
    useEffect(() => {
        api.url = v.value;
    }, [v.value]);
    return <TextField title={"URL"} value={v}/>;
}

function ResetDaySec() {
    const v = useObservable(String(api.reset_day ?? " 1"));
    useEffect(() => {
        api.reset_day = Number(v.value);
    }, [v.value]);
    return <TextField title={"重置日期"} value={v}/>;
}

function MethodSec() {
    const v = useObservable(api.method);
    useEffect(() => {
        api.method = v.value;
    }, [v.value]);
    return <TextField title={"Method"} value={v}/>;
}
function UaSec() {
    const v = useObservable(api.ua);
    useEffect(() => {
        api.ua = v.value;
    }, [v.value]);
    return <TextField title={"UA"} value={v}/>;
}