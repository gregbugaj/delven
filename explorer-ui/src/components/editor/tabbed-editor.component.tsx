import {EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiPanel} from "@elastic/eui"
import React, {useState, Fragment, useMemo} from "react"

import {
    EuiIcon,
    EuiTabs,
    EuiTab,
    EuiSpacer,
    EuiText,
    EuiNotificationBadge
} from "@elastic/eui"

import "../globalServices"

const tabs = [
    {
        id: "cobalt--id",
        name: "Cobalt",
        content: (
            <Fragment>
                <EuiSpacer />
                <EuiText>
                    <p>
                        Cobalt is a chemical element with symbol Co and atomic number 27.
                        Like nickel, cobalt is found in the Earth&rsquo;s crust only in
                        chemically combined form, save for small deposits found in alloys of
                        natural meteoric iron. The free element, produced by reductive
                        smelting, is a hard, lustrous, silver-gray metal.
                    </p>
                </EuiText>
            </Fragment>
        )
    },
    {
        id: "dextrose--id",
        name: "Dextrose",
        content: (
            <Fragment>
                <EuiSpacer />
                <EuiText>
                    <p>
                        Intravenous sugar solution, also known as dextrose solution, is a
                        mixture of dextrose (glucose) and water. It is used to treat low
                        blood sugar or water loss without electrolyte loss.
                    </p>
                </EuiText>
            </Fragment>
        )
    },
    {
        id: "hydrogen--id",
        disabled: false,
        name: "Hydrogen",
        prepend: <EuiIcon type="heatmap" />,
        content: (
            <Fragment>
                <EuiSpacer />
                <EuiText>
                    <p>
                        Hydrogen is a chemical element with symbol H and atomic number 1.
                        With a standard atomic weight of 1.008, hydrogen is the lightest
                        element on the periodic table
                    </p>
                </EuiText>
            </Fragment>
        )
    },
    {
        id: "monosodium_glutammate--id",
        name: "Monosodium Glutamate",
        append: (
            <EuiNotificationBadge className="eui-alignCenter" size="m">
                10
            </EuiNotificationBadge>
        ),
        href: "#/navigation/tabs#monosodium",
        content: (
            <Fragment>
                <EuiSpacer />
                <EuiText>
                    <p>
                        Monosodium glutamate (MSG, also known as sodium glutamate) is the
                        sodium salt of glutamic acid, one of the most abundant naturally
                        occurring non-essential amino acids. Monosodium glutamate is found
                        naturally in tomatoes, cheese and other foods.
                    </p>
                </EuiText>
            </Fragment>
        )
    }
]


function TabbedEditorComponent({
                                   isVisible,
                                   label
                               }: React.PropsWithChildren<{isVisible: boolean, label: string}>) {

    console.info(`Tabbed Component visible : ${isVisible} : [${label}]`)

    const [selectedTabId, setSelectedTabId] = useState("cobalt--id")
    const selectedTabContent = useMemo(() => {
        return tabs.find((obj) => obj.id === selectedTabId)?.content
    }, [selectedTabId])

    const onSelectedTabChanged = (id: string) => {
        setSelectedTabId(id)
    }

    const renderTabs = () => {
        return tabs.map((tab, index) => (
            <EuiTab
                key={index}
                href={tab.href}
                onClick={() => onSelectedTabChanged(tab.id)}
                isSelected={tab.id === selectedTabId}
                disabled={tab.disabled}
                prepend={tab.prepend}
                append={tab.append}
            >
                {tab.name}
            </EuiTab>
        ))
    }

    // Both flex-groups need to have eui-fullHeight in order to have scrollable container
    return (

        <EuiFlexItem
            style={{background: "#FFF", padding: "0px", margin: "0px", border: "0px solid red"}}
            grow={true}>

            <EuiTabs size={"s"}>{renderTabs()}</EuiTabs>
            {selectedTabContent}
        </EuiFlexItem>
    )
}

export default React.memo(TabbedEditorComponent)
