import {EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiPanel, EuiResizableContainer} from "@elastic/eui"
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
import ResizibleDivider from "../explorer/ResizibleDivider"

const tabs = [
    {
        id: "cobalt--id",
        name: "Cobalt",
        content: (
            <Fragment>
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
    <>
        <div style={{ display:"flex", width:"100%", height:"25%"}}>
            <div style={{ display:"flex", width:"50%"}}>Left</div>
                    <ResizibleDivider direction="horizontal"/>
            <div style={{ display:"flex", width:"50%"}}>Right</div>
        </div>


        <div style={{background: "#FFF", display:"flex", width:"100%",  padding: "0px", margin: "0px", border: "2px solid purple"}}>
            <div  style={{ position:"relative", background: "#FFF", width:"25%",  padding: "0px", margin: "0px", border: "2px solid green"}}>
                LHS
            </div>

            <ResizibleDivider direction="horizontal" />

            <div style={{position:"relative", background: "#FFF", width:"25%", padding: "0px", margin: "0px", border: "2px solid blue"}}>
                RHS
            </div>
        </div>

                <hr/>
        <EuiResizableContainer onPanelWidthChange={() => {
            console.info("Resized")
        }}>

            {(EuiResizablePanel, EuiResizableButton) => (
                <>
                    <EuiResizablePanel initialSize={50} minSize="200px" mode="custom" style={{border:"1px solid red"}}>
                        LHS Panel
                    </EuiResizablePanel>

                    <EuiResizableButton style={{border: "5px solid pink", width:"1px"}} />

                    <EuiResizablePanel initialSize={50} minSize="200px"  style={{border:"1px solid blue"}}>
                        Right Panel
                        <div>
                            Content Window Panel<br />
                            RenderTime : {Date.now()}
                        </div>

                    </EuiResizablePanel>
                </>
            )}
        </EuiResizableContainer>

   </>
    )

}


/*

<EuiFlexItem grow={false}    className="eui-fullHeight" style={{background: "#FFF", width:"50%",  padding: "0px", margin: "0px", border: "2px solid red"}}>


    <EuiFlexItem grow={false}  style={{background: "#FFF", width:"50%",  padding: "0px", margin: "0px", border: "2px solid green"}}>
        LHS
    </EuiFlexItem>

    <ResizibleDivider direction="horizontal" />

    <EuiFlexItem grow={false}  style={{background: "#FFF", width:"50%", padding: "0px", margin: "0px", border: "2px solid blue"}}>
        RHS
    </EuiFlexItem>

</EuiFlexItem>
*/



/*

        <EuiFlexGroup
            className="eui-fullHeight"
            gutterSize="none"
            direction="row"
        >
        </EuiFlexGroup>



                <EuiFlexGroup
                    style={{background: "#FFF", padding: "0px", margin: "0px", border: "0px solid green"}}
                    gutterSize="none"
                    direction="column"
                >

                    <EuiFlexItem grow={false}>
                        <EuiFlexGroup gutterSize="none"
                                      responsive={false}
                                      style={{
                                          background: "#FFF",
                                          padding: "0px",
                                          margin: "0px",
                                          border: "0px solid red"
                                      }}>
                            <EuiFlexItem grow={true}>
                                <EuiTabs size={"s"}>{renderTabs()}</EuiTabs>
                            </EuiFlexItem>

                            <EuiFlexItem grow={false}>
                                Expand | Collapse
                            </EuiFlexItem>

                        </EuiFlexGroup>
                    </EuiFlexItem>

                    <hr/>
                    <EuiFlexItem grow={true}
                                 style={{background: "#FFF", padding: "0px", margin: "0px", border: "0px solid red"}}>
                        {selectedTabContent}
                    </EuiFlexItem>
                </EuiFlexGroup>

*/

/*
<EuiFlexGroup
    style={{background: "#FFF", padding: "0px", margin: "0px", border: "4px solid green"}}
    grow={true}
    className="eui-fullHeight"
    gutterSize="none"
    direction="column"
>
    <EuiFlexItem grow={false}>
        {/!*        <EuiFlexGroup gutterSize="none"
                              responsive={false}
                              style={{background: "#FFF", padding: "0px", margin: "0px", border: "1px solid red"}}>
                    <EuiFlexItem grow={true}>
                        <EuiTabs size={"s"}>{renderTabs()}</EuiTabs>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        RHS
                    </EuiFlexItem>
                </EuiFlexGroup>*!/}
    </EuiFlexItem>

    <EuiFlexItem grow={true}
                 style={{background: "#CCC", padding: "0px", margin: "0px", border: "1px solid red"}}>
        {selectedTabContent}
    </EuiFlexItem>
</EuiFlexGroup>

*/

export default React.memo(TabbedEditorComponent)


/*

<EuiFlexGroup
style={{background: "#FFF", padding: "0px", margin: "0px", border: "4px solid green"}}
grow={true}
className="eui-fullHeight"
gutterSize="none"
direction="column"
    >
    <EuiFlexItem grow={false}>
    <EuiFlexGroup gutterSize="none"
responsive={false}
style={{background: "#FFF", padding: "0px", margin: "0px", border: "1px solid red"}}>
<EuiFlexItem grow={true}>
    <EuiTabs size={"s"}>{renderTabs()}</EuiTabs>
</EuiFlexItem>
<EuiFlexItem grow={false}>
    RHS
</EuiFlexItem>
</EuiFlexGroup>
</EuiFlexItem>

<EuiFlexItem grow={true}
             style={{background: "#CCC", padding: "0px", margin: "0px", border: "1px solid red"}}>
    {selectedTabContent}
</EuiFlexItem>
</EuiFlexGroup>*/
