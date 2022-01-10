import React, {useState} from 'react';

import {
    EuiHeaderLogo,
    EuiHeader,
    EuiPageTemplate,
    EuiFlexItem,
    EuiButtonIcon,
    EuiPanel,
    EuiControlBar,
    EuiFlexGroup,
    EuiHeaderSectionItem,
    EuiHeaderLinks,
    EuiHeaderLink,
    EuiHeaderSection,
    EuiHeaderSectionItemButton,
    EuiIcon,
    EuiButton,
    useGeneratedHtmlId,
} from '@elastic/eui';

import "../../App.css";
import {ThemeProvider} from "./ReferenceDataContext";
import EditorPanel from "./EditorPanel";
import WorkspacePanel from "./WorkspacePanel";
import SettingsPanel from "./SettingsPanel";
import {ContentWindow} from "./ContentWindow";

const ExplorerAppLayout = () => {

    const exitPath = () => {
        return "#"
    };
    const [navIsOpen, setNavIsOpen] = useState(true);

    /**
     * Accordion toggling
     */
    const [openGroups, setOpenGroups] = useState(
        JSON.parse(String(localStorage.getItem('openNavGroups'))) || [
            'Kibana',
            'Learn',
        ]
    );

    // Save which groups are open and which are not with state and local store
    const toggleAccordion = (isOpen: boolean, title?: string) => {
        if (!title) return;
        const itExists = openGroups.includes(title);
        if (isOpen) {
            if (itExists) return;
            openGroups.push(title);
        } else {
            const index = openGroups.indexOf(title);
            if (index > -1) {
                openGroups.splice(index, 1);
            }
        }
        setOpenGroups([...openGroups]);
        localStorage.setItem('openNavGroups', JSON.stringify(openGroups));
    };

    const collapsibleNavId = useGeneratedHtmlId({prefix: 'collapsibleNav'});

    return (
        <>
            <EuiHeader
                position="static"

            >

                <EuiHeaderSection grow={false}>
                    <EuiHeaderSectionItem>
                        <EuiHeaderLogo href='#' iconType="logoElastic">
                            Delven
                        </EuiHeaderLogo>

                        <EuiHeaderLinks aria-label="App navigation links">
                            <EuiButton size="s">Share</EuiButton>
                            <EuiButton size="s">Fork</EuiButton>
                        </EuiHeaderLinks>

                    </EuiHeaderSectionItem>
                </EuiHeaderSection>

                <EuiHeaderSection grow={false}>

                    <EuiHeaderSectionItem>
                        <EuiHeaderLinks aria-label="App navigation">
                            <EuiHeaderLink>Docs</EuiHeaderLink>
                            <EuiHeaderLink>Code</EuiHeaderLink>
                            <EuiHeaderLink iconType="help">Help</EuiHeaderLink>
                        </EuiHeaderLinks>
                    </EuiHeaderSectionItem>
                </EuiHeaderSection>
            </EuiHeader>

            <SidenavWithContent/>
        </>
    );
};

export const SidenavWithContent = () => {

    const [counterA, setCounterA] = React.useState(0);
    const [counterB, setCounterB] = React.useState(0);

    const [compileTime, setCompileTime] = React.useState(0);
    const [renderType, setRenderType] = React.useState("editor");
    // https://kentcdodds.com/blog/how-to-use-react-context-effectively
    // const CountContext = React.createContext({ch:1, line:1})
    const [pos, setEditorPosition] = React.useState({ch: 0, line: 0});
    const [open, setOpen] = React.useState(true);

    function handleViewChange(renderTypeChange: string) {
        if (renderTypeChange != renderType) {
            setOpen(true);
            setRenderType(renderTypeChange)
        } else if (renderTypeChange == renderType) {
            setOpen(!open);
        }
    }

    // @ts-ignore
    return (

        <EuiPageTemplate fullHeight template="empty" restrictWidth={false} paddingSize='none'>

            <div>
                <Counter
                    name="A"
                    value={counterA}
                    onClickIncrement={React.useCallback(() => setCounterA(counterA + 1), [
                        counterA,
                    ])}
                />
                <hr/>
                <Counter
                    name="B"
                    value={counterB}
                    onClickIncrement={React.useCallback(() => setCounterB(counterB + 1), [
                        counterB,
                    ])}
                />
            </div>

            <EuiFlexGroup
                className="eui-fullHeight"
                gutterSize="none"
                direction="column"
                responsive={false}
            >

                {/* <EuiFlexItem grow={false}>
        <EuiPanel color="danger" >
          TOP Panel
        </EuiPanel>
      </EuiFlexItem> 

      <EuiSpacer size="l" />

      */}

                {/* eui-yScroll */}
                <EuiFlexItem className="eui-fullHeight">
                    <EuiFlexGroup className="eui-fullHeight" gutterSize="none">

                        <EuiFlexItem grow={false}>
                            <EuiPanel tabIndex={0} className="eui-"
                                      hasShadow={false}
                                      hasBorder={false}
                                      borderRadius='none'
                                      paddingSize='none'
                                      style={{background: '#404040', padding: '8px'}}
                            >

                                <EuiFlexGroup
                                    gutterSize="none"
                                    direction="column"
                                    className="eui-fullHeight"
                                >

                                    <EuiFlexItem grow={true}>
                                        <EuiButtonIcon
                                            iconType="apps"
                                            aria-label="Applications"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            style={{marginBottom: '16px'}}
                                            onClick={() => {
                                                console.info("Apps clicked")
                                            }}
                                        />

                                        <EuiButtonIcon
                                            iconType="documents"
                                            aria-label="Sessions and Editors"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            style={{marginBottom: '16px'}}
                                            onClick={(e) => handleViewChange('editor')}
                                        />

                                        <EuiButtonIcon
                                            iconType="database"
                                            aria-label="Queries"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            style={{marginBottom: '16px'}}
                                            onClick={(e) => handleViewChange('workspace')}
                                        />

                                        <EuiButtonIcon
                                            iconType="branch"
                                            aria-label="Share"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            style={{marginBottom: '16px'}}
                                            onClick={() => {
                                                console.info("Branch/Share clicked")
                                            }}
                                        />

                                        <EuiButtonIcon
                                            iconType="gear"
                                            aria-label="Apps"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            style={{marginBottom: '16px'}}
                                            onClick={(e) => handleViewChange('settings')}
                                        />

                                        <EuiButtonIcon
                                            iconType="console"
                                            aria-label="Apps"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            style={{marginBottom: '16px'}}
                                            onClick={(e) => handleViewChange('terminal')}
                                        />
                                    </EuiFlexItem>

                                    {/* anchor to the bottom of the view */}
                                    <EuiFlexItem grow={false}>
                                        <EuiButtonIcon
                                            iconType="help"
                                            aria-label="Icon button"
                                            color="ghost"
                                            size="m"
                                            iconSize="xl"
                                            onClick={(e) => handleViewChange('help')}
                                        />
                                    </EuiFlexItem>
                                </EuiFlexGroup>
                            </EuiPanel>
                        </EuiFlexItem>

                        <EuiFlexItem grow={false} style={{
                            background: ' ',
                            padding: '0px',
                            margin: '0px',
                            maxWidth: '400px',
                            minWidth: '280px'
                        }}>
                            RenderType : {renderType} {Date.now()}
                            {/* <TerminalPanel></TerminalPanel> */}
                            {/* <EditorPanel></EditorPanel> */}
                            {/* <WorkspacePanel></WorkspacePanel> */}
                            {/* <SettingsPanel></SettingsPanel> */}

                            <div id='side-container-editor' style={{
                                display: renderType === 'editor' ? "flex" : "none",
                                flexDirection: 'column',
                                height: '100%'
                            }}>
                                editor
                                RenderType : {renderType} {Date.now()}
                                {/*<EditorPanel></EditorPanel>*/}
                            </div>

                            <div id='side-container-workspace' style={{
                                display: renderType === 'workspace' ? "flex" : "none",
                                flexDirection: 'column',
                                height: '100%'
                            }}>
                                workspace
                                RenderType : {renderType} {Date.now()}
                                {/*<WorkspacePanel></WorkspacePanel>*/}
                            </div>

                            <div id='side-container-settings' style={{
                                display: renderType === 'settings' ? "flex" : "none",
                                flexDirection: 'column',
                                height: '100%'
                            }}>
                                settings
                                RenderType : {renderType} {Date.now()}
                                {/*<SettingsPanel></SettingsPanel>*/}
                            </div>

                            <div id='side-container-runners' style={{
                                display: renderType === 'runners' ? "flex" : "none",
                                flexDirection: 'column',
                                height: '100%'
                            }}>
                                runners
                                RenderType : {renderType} {Date.now()}
                            </div>

                            <div id={`side-container-help`} style={{
                                display: renderType === 'help' ? "flex" : "none",
                                flexDirection: 'column',
                                height: '100%'
                            }}>
                                help
                                RenderType : {renderType} {Date.now()}
                            </div>

                        </EuiFlexItem>

                        <EuiFlexItem>
                            <EuiPanel
                                tabIndex={0}
                                // className="eui-yScroll"
                                hasShadow={false}
                                hasBorder={false}
                                borderRadius='none'
                                paddingSize='none'
                                style={{background: '#CCC', padding: '0px', margin: '0px'}}
                            >
                                {/* main content panel */}
                                RenderType : {renderType} {Date.now()}
                                <ContentWindow children={undefined} className={undefined}/>
                            </EuiPanel>
                        </EuiFlexItem>


                    </EuiFlexGroup>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>

                    <EuiPanel
                        hasShadow={false}
                        hasBorder={false}
                        borderRadius='none'
                        paddingSize='none'
                        style={{background: ' ', padding: '0px', margin: '0px', minHeight: '80px'}}
                    >

                        <EuiControlBar
                            size="s"
                            position='relative'
                            showContent={false}
                            controls={
                                [{
                                    iconType: 'submodule',
                                    id: 'root_icon',
                                    controlType: 'icon',
                                    'aria-label': 'Project Root',
                                },
                                    {
                                        controlType: 'breadcrumbs',
                                        id: 'current_file_path',
                                        responsive: true,
                                        breadcrumbs: [
                                            {
                                                text: 'src',
                                            },
                                            {
                                                text: 'components',
                                            },
                                        ],
                                    },
                                    {
                                        controlType: 'spacer',
                                    },
                                    {
                                        controlType: 'icon',
                                        id: 'status_icon',
                                        iconType: 'alert',
                                        color: 'warning',
                                        'aria-label': 'Repo Status',
                                    },
                                    {
                                        controlType: 'divider',
                                    },
                                    {
                                        controlType: 'button',
                                        id: 'open_history_view',
                                        label: 'Show history',
                                        color: 'primary',
                                        onClick: () => {
                                        }
                                    }]
                            }
                        />


                    </EuiPanel>

                </EuiFlexItem>

            </EuiFlexGroup>


        </EuiPageTemplate>
    )
};

const Counter = React.memo(function Counter({name, value, onClickIncrement}) {
    console.log(`Rendering counter ${name}`);
    return (
        <div>
            {name}: {value}
            <button onClick={onClickIncrement}>Increment</button>
        </div>
    );
});

export default ExplorerAppLayout;