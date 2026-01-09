import {
    Button,
    Gauge,
    HStack,
    Image,
    List,
    Navigation,
    NavigationStack,
    ProgressView,
    Script,
    Section,
    Spacer,
    Text,
    VStack,
    useEffect,
    useObservable,
} from "scripting";
import {api} from "../util/api";
import {View as SettingView} from "./setting";
import {yellow} from "../util/const";

export function View() {
    const dismiss = Navigation.useDismiss();
    return (
        <NavigationStack>
            <StackView
                navigationTitle={Script.name}
                toolbar={{
                    topBarLeading: [<Button title={"关闭"} systemImage={"xmark"} action={dismiss}/>],
                    topBarTrailing: [
                        <Button
                            title={"设置"}
                            systemImage={"gear"}
                            action={() => Navigation.present(<SettingView/>)}
                        />,
                    ],
                }}
            />
        </NavigationStack>
    );
}

function bytesToSize(bytes: number) {
    if (bytes === 0) return "0 B"

    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]
}

function StackView() {
    const data = useObservable<any>(null);

    async function fetchData() {
        try {
            const r = await api.getUsage();
            if (r) data.setValue(r);
        } catch (e) {
            await Dialog.alert({message: "获取数据失败，请检查机场信息是否正确"});
            await Navigation.present(<SettingView/>);
            fetchData();
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (data.value === null) {
        return <ProgressView/>;
    }

    const {max, used} = data.value;
    return (
        <List refreshable={fetchData}>
            <Section title={""}>
                <HStack>
                    <VStack>
                        <Text>{"已用："}</Text>
                        <Text font={"subheadline"}> {bytesToSize(used)}</Text>
                    </VStack>
                    <Spacer/>
                    <VStack alignment={"trailing"}>
                        <Text font={"headline"}>{"全部："}</Text>
                        <Text font={"subheadline"} foregroundStyle={"secondaryLabel"}>
                            {bytesToSize(max)}
                        </Text>
                    </VStack>
                </HStack>
            </Section>
        </List>
    );
}
