import {Text, Gauge, Image} from "scripting";
import {formatNumber} from "../util/format";

export function View({all, used}: { all: number; used: number }) {
    const value = used;
    const remain = all - value;


    return (
        <Gauge
            gaugeStyle="accessoryCircular"
            min={0}
            max={all}
            value={value}
            tint={"tertiaryLabel"}
            label={<Image systemName={"cloud.fill"} foregroundStyle="secondaryLabel"/>}
            currentValueLabel={<Text>{(value)}</Text>}
        />
    );
}
