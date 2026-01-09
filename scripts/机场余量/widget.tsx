import { Button, Widget } from "scripting";
import { ReloadIntent } from "./app_intents";
import { api } from "./util/api";
import { View as Circle } from "./widget/circular";
import { View as Small } from "./widget/small";

(async () => {
    if (!api.url) throw new Error("链接失效");
    if (!api.reset_day) api.reset_day = 1

    // const { all, pages, workers } = { all: 0, pages: 0, workers: 0 };
    const { max, used,expire } = await api.getUsage() ?? { max: 0, used: 0,expire: 0 }
    console.log(used)
    switch (Widget.family) {
        case "systemSmall":
            Widget.present(
                <Button intent={ReloadIntent(undefined)} buttonStyle={"plain"}>
                    <Small all={max} used={used} expire={expire} />
                </Button>
            );
            break;
        default:
            throw new Error("未适配的 Widget 尺寸");
    }
})().catch(async (e) => {
    const { Text } = await import("scripting");
    Widget.present(<Text>{String(e)}</Text>);
});
