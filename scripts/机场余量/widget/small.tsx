import {HStack, VStack, Text, Image, Path, Script, Gauge, Spacer} from "scripting";
import {yellow} from "../util/const";

// import { formatNumber } from "../utils/format";

export function View({all, used,expire}: { all: number; used: number;expire: number }) {
    const iconSize = 14;

    function bytesToSize(bytes: number) {
        if (bytes === 0) return "0 B"

        const k = 1024
        const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]
    }


    function formatTime(time: number) {
        if (!time) return "-"

        // 秒级时间戳转毫秒
        if (time < 1e12) {
            time *= 1000
        }

        const date = new Date(time)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        return `${year}年${month}月${day}日`
    }

    return (
        <VStack padding={true}>
            <HStack spacing={11}>
                <VStack>
                    <Gauge
                        gaugeStyle="accessoryCircular"
                        min={0}
                        max={all}
                        value={used}
                        tint={"tertiarySystemBackground"}
                        currentValueLabel={
                            <Text bold={true} foregroundStyle="lightGray">
                                {bytesToSize(used)}
                            </Text>
                        }
                        label={
                            <Image
                                systemName={"bolt.fill"}
                                resizable={true}
                                scaleToFit={true}
                                foregroundStyle={"secondaryLabel"}
                                frame={{width: iconSize, height: iconSize}}
                            />
                        }
                    />
                    <Text padding={{top: -8}} bold={true} font={"footnote"} foregroundStyle={yellow}>
                        {"Used"}
                    </Text>
                </VStack>
                <VStack>
                    <Gauge
                        gaugeStyle="accessoryCircular"
                        min={0}
                        max={0}
                        value={all}
                        tint={"tertiarySystemBackground"}
                        currentValueLabel={
                            <Text bold={true} foregroundStyle="lightGray">
                                {bytesToSize(all)}
                            </Text>
                        }
                        label={
                            <Image
                                systemName={"square.2.layers.3d.fill"}
                                symbolRenderingMode={"hierarchical"}
                                resizable={true}
                                scaleToFit={true}
                                foregroundStyle={"secondaryLabel"}
                                rotationEffect={270}
                                frame={{width: iconSize, height: iconSize}}
                            />
                        }
                    />
                    <Text padding={{top: -8}} bold={true} font={"footnote"} foregroundStyle={yellow}>
                        {"Total"}
                    </Text>
                </VStack>
            </HStack>
            <Spacer/>
            <HStack font={"subheadline"}>
                <Text bold={true} foregroundStyle="secondaryLabel">
                    {"Expire:"}
                </Text>
            </HStack>
            <Spacer/>
            <HStack>
                <Text bold={true} foregroundStyle="secondaryLabel">
                    {formatTime(expire)}
                </Text>
            </HStack>
        </VStack>
    );
}

function Header() {
    const logoSize = 32;
    return (
        <HStack>
            <Text font={"headline"} foregroundStyle={yellow}>
                {""}
            </Text>
        </HStack>
    );
}
