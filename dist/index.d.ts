/// <reference types="jquery" />
/***
 * A base class that all special / non-data rows (like Group and GroupTotals) derive from.
 */
declare class NonDataRow {
    __nonDataRow: boolean;
}
declare const preClickClassName = "slick-edit-preclick";

declare type Handler<TArgs, TEventData extends IEventData = IEventData> = (e: TEventData, args: TArgs) => void;
interface IEventData {
    readonly type?: string;
    currentTarget?: EventTarget | null;
    target?: EventTarget | null;
    originalEvent?: any;
    defaultPrevented?: boolean;
    preventDefault?(): void;
    stopPropagation?(): void;
    stopImmediatePropagation?(): void;
    isDefaultPrevented?(): boolean;
    isImmediatePropagationStopped?(): boolean;
    isPropagationStopped?(): boolean;
}
/***
 * An event object for passing data to event handlers and letting them control propagation.
 * <p>This is pretty much identical to how W3C and jQuery implement events.</p>
 * @class EventData
 * @constructor
 */
declare class EventData implements IEventData {
    private _isPropagationStopped;
    private _isImmediatePropagationStopped;
    /***
     * Stops event from propagating up the DOM tree.
     * @method stopPropagation
     */
    stopPropagation(): void;
    /***
     * Returns whether stopPropagation was called on this event object.
     * @method isPropagationStopped
     * @return {Boolean}
     */
    isPropagationStopped(): boolean;
    /***
     * Prevents the rest of the handlers from being executed.
     * @method stopImmediatePropagation
     */
    stopImmediatePropagation(): void;
    /***
     * Returns whether stopImmediatePropagation was called on this event object.\
     * @method isImmediatePropagationStopped
     * @return {Boolean}
     */
    isImmediatePropagationStopped(): boolean;
}
/***
 * A simple publisher-subscriber implementation.
 * @class Event
 * @constructor
 */
declare class Event<TArgs = any, TEventData extends IEventData = IEventData> {
    private _handlers;
    /***
     * Adds an event handler to be called when the event is fired.
     * <p>Event handler will receive two arguments - an <code>EventData</code> and the <code>data</code>
     * object the event was fired with.<p>
     * @method subscribe
     * @param fn {Function} Event handler.
     */
    subscribe(fn: Handler<TArgs, TEventData>): void;
    /***
     * Removes an event handler added with <code>subscribe(fn)</code>.
     * @method unsubscribe
     * @param fn {Function} Event handler to be removed.
     */
    unsubscribe(fn: Handler<TArgs, TEventData>): void;
    /***
     * Fires an event notifying all subscribers.
     * @method notify
     * @param args {Object} Additional data object to be passed to all handlers.
     * @param e {EventData}
     *      Optional.
     *      An <code>EventData</code> object to be passed to all handlers.
     *      For DOM events, an existing W3C/jQuery event object can be passed in.
     * @param scope {Object}
     *      Optional.
     *      The scope ("this") within which the handler will be executed.
     *      If not specified, the scope will be set to the <code>Event</code> instance.
     */
    notify(args?: any, e?: TEventData, scope?: object): any;
    clear(): void;
}
declare class EventHandler<TArgs = any, TEventData extends IEventData = IEventData> {
    private _handlers;
    subscribe(event: Event<TArgs, TEventData>, handler: Handler<TArgs, TEventData>): this;
    unsubscribe(event: Event<TArgs, TEventData>, handler: Handler<TArgs, TEventData>): this;
    unsubscribeAll(): EventHandler<TArgs, TEventData>;
}
declare const keyCode: {
    BACKSPACE: number;
    DELETE: number;
    DOWN: number;
    END: number;
    ENTER: number;
    ESCAPE: number;
    HOME: number;
    INSERT: number;
    LEFT: number;
    PAGEDOWN: number;
    PAGEUP: number;
    RIGHT: number;
    TAB: number;
    UP: number;
};
declare function patchEvent(e: IEventData): IEventData;

interface EditController {
    commitCurrentEdit(): boolean;
    cancelCurrentEdit(): boolean;
}
/***
 * A locking helper to track the active edit controller and ensure that only a single controller
 * can be active at a time.  This prevents a whole class of state and validation synchronization
 * issues.  An edit controller (such as SleekGrid) can query if an active edit is in progress
 * and attempt a commit or cancel before proceeding.
 * @class EditorLock
 * @constructor
 */
declare class EditorLock {
    private activeEditController;
    /***
     * Returns true if a specified edit controller is active (has the edit lock).
     * If the parameter is not specified, returns true if any edit controller is active.
     * @method isActive
     * @param editController {EditController}
     * @return {Boolean}
     */
    isActive(editController?: EditController): boolean;
    /***
     * Sets the specified edit controller as the active edit controller (acquire edit lock).
     * If another edit controller is already active, and exception will be thrown.
     * @method activate
     * @param editController {EditController} edit controller acquiring the lock
     */
    activate(editController: EditController): void;
    /***
     * Unsets the specified edit controller as the active edit controller (release edit lock).
     * If the specified edit controller is not the active one, an exception will be thrown.
     * @method deactivate
     * @param editController {EditController} edit controller releasing the lock
     */
    deactivate(editController: EditController): void;
    /***
     * Attempts to commit the current edit by calling "commitCurrentEdit" method on the active edit
     * controller and returns whether the commit attempt was successful (commit may fail due to validation
     * errors, etc.).  Edit controller's "commitCurrentEdit" must return true if the commit has succeeded
     * and false otherwise.  If no edit controller is active, returns true.
     * @method commitCurrentEdit
     * @return {Boolean}
     */
    commitCurrentEdit(): boolean;
    /***
     * Attempts to cancel the current edit by calling "cancelCurrentEdit" method on the active edit
     * controller and returns whether the edit was successfully cancelled.  If no edit controller is
     * active, returns true.
     * @method cancelCurrentEdit
     * @return {Boolean}
     */
    cancelCurrentEdit(): boolean;
}
/***
 * A global singleton editor lock.
 * @class GlobalEditorLock
 * @static
 * @constructor
 */
declare const GlobalEditorLock: EditorLock;

/***
 * Information about a group of rows.
 */
declare class Group<TEntity = any> extends NonDataRow {
    readonly __group = true;
    /**
     * Grouping level, starting with 0.
     * @property level
     * @type {Number}
     */
    level: number;
    /***
     * Number of rows in the group.
     * @property count
     * @type {Number}
     */
    count: number;
    /***
     * Grouping value.
     * @property value
     * @type {Object}
     */
    value: any;
    /***
     * Formatted display value of the group.
     * @property title
     * @type {String}
     */
    title: string;
    /***
     * Whether a group is collapsed.
     * @property collapsed
     * @type {Boolean}
     */
    collapsed: boolean;
    /***
     * GroupTotals, if any.
     * @property totals
     * @type {GroupTotals}
     */
    totals: GroupTotals<TEntity>;
    /**
     * Rows that are part of the group.
     * @property rows
     * @type {Array}
     */
    rows: TEntity[];
    /**
     * Sub-groups that are part of the group.
     * @property groups
     * @type {Array}
     */
    groups: Group<TEntity>[];
    /**
     * A unique key used to identify the group.  This key can be used in calls to DataView
     * collapseGroup() or expandGroup().
     * @property groupingKey
     * @type {Object}
     */
    groupingKey: string;
    /***
     * Compares two Group instances.
     * @method equals
     * @return {Boolean}
     * @param group {Group} Group instance to compare to.
     */
    equals(group: Group): boolean;
}
/***
 * Information about group totals.
 * An instance of GroupTotals will be created for each totals row and passed to the aggregators
 * so that they can store arbitrary data in it.  That data can later be accessed by group totals
 * formatters during the display.
 * @class GroupTotals
 * @extends NonDataRow
 * @constructor
 */
declare class GroupTotals<TEntity = any> extends NonDataRow {
    readonly __groupTotals = true;
    /***
     * Parent Group.
     * @param group
     * @type {Group}
     */
    group: Group<TEntity>;
    /***
     * Whether the totals have been fully initialized / calculated.
     * Will be set to false for lazy-calculated group totals.
     * @param initialized
     * @type {Boolean}
     */
    initialized: boolean;
    /**
     * Contains sum
     */
    sum?: number;
    /**
     * Contains avg
     */
    avg?: number;
    /**
     * Contains min
     */
    min?: any;
    /**
     * Contains max
     */
    max?: any;
}

declare class Range {
    fromRow: number;
    fromCell: number;
    toRow: number;
    toCell: number;
    constructor(fromRow: number, fromCell: number, toRow?: number, toCell?: number);
    /***
     * Returns whether a range represents a single row.
     */
    isSingleRow(): boolean;
    /***
     * Returns whether a range represents a single cell.
     */
    isSingleCell(): boolean;
    /***
     * Returns whether a range contains a given cell.
     */
    contains(row: number, cell: number): boolean;
    /***
     * Returns a readable representation of a range.
     */
    toString(): string;
}

declare function addClass(el: Element, cls: string): void;
declare function attrEncode(s: any): string;
declare function disableSelection(target: HTMLElement): void;
declare function removeClass(el: Element, cls: string): void;
declare function H<K extends keyof HTMLElementTagNameMap>(tag: K, attr?: {
    [key: string]: (string | boolean);
}, ...children: Node[]): HTMLElementTagNameMap[K];
declare function htmlEncode(s: any): string;
declare function spacerDiv(width: string): HTMLDivElement;

interface IPlugin {
    init(grid: Grid): void;
    pluginName?: string;
    destroy?: () => void;
}
interface Position {
    bottom?: number;
    height?: number;
    left?: number;
    right?: number;
    top?: number;
    visible?: boolean;
    width?: number;
}
interface ViewportInfo {
    height: number;
    width: number;
    hasVScroll: boolean;
    hasHScroll: boolean;
    headerHeight: number;
    groupingPanelHeight: number;
    virtualHeight: number;
    realScrollHeight: number;
    topPanelHeight: number;
    headerRowHeight: number;
    footerRowHeight: number;
    numVisibleRows: number;
}
interface RowCell {
    row: number;
    cell: number;
}
interface SelectionModel extends IPlugin {
    setSelectedRanges(ranges: Range[]): void;
    onSelectedRangesChanged: Event<Range[]>;
    refreshSelections?(): void;
}
interface ViewRange {
    top?: number;
    bottom?: number;
    leftPx?: number;
    rightPx?: number;
}

interface EditorOptions {
    grid: Grid;
    gridPosition?: Position;
    position?: Position;
    column?: Column;
    columnMetaData?: ColumnMetadata<any>;
    container?: HTMLElement;
    item?: any;
    event: IEventData;
    commitChanges?: () => void;
    cancelChanges?: () => void;
}
interface Editor {
    new (options: EditorOptions): Editor;
    destroy(): void;
    applyValue(item: any, value: any): void;
    focus(): void;
    isValueChanged(): boolean;
    keyCaptureList?: number[];
    loadValue(value: any): void;
    serializeValue(): any;
    position?(pos: Position): void;
    preClick?(): void;
    hide?(): void;
    show?(): void;
    suppressClearOnEdit?: boolean;
    validate?(): ValidationResult;
}
interface EditorFactory {
    getEditor(column: Column): Editor;
}
interface EditCommand {
    row: number;
    cell: number;
    editor: Editor;
    serializedValue: any;
    prevSerializedValue: any;
    execute: () => void;
    undo: () => void;
}
interface ValidationResult {
    valid: boolean;
    msg?: string;
}

interface FormatterFactory<TItem = any> {
    getFormatter(column: Column<TItem>): ColumnFormatter<TItem>;
}
interface FormatterResult {
    addClass?: string;
    addAttrs?: {
        [key: string]: string;
    };
    html?: string;
    text?: string;
    toolTip?: string;
}
declare type ColumnFormatter<TItem = any> = (row: number, cell: number, value: any, column: Column<TItem>, item: TItem, grid?: Grid<TItem>) => string | FormatterResult;
declare type AsyncPostRender<TItem = any> = (cellNode: HTMLElement, row: number, item: TItem, column: Column<TItem>, reRender: boolean) => void;
declare type AsyncPostCleanup<TItem = any> = (cellNode: HTMLElement, row?: number, column?: Column<TItem>) => void;
declare type CellStylesHash = {
    [row: number]: {
        [cell: number]: string;
    };
};
declare function defaultFormatter(_r: number, _c: number, value: any): string;
declare function applyFormatterResultToCellNode(fmtResult: FormatterResult | string, cellNode: HTMLElement): void;

interface ArgsGrid {
    grid?: Grid;
}
interface ArgsColumn extends ArgsGrid {
    column: Column;
}
interface ArgsColumnNode extends ArgsColumn {
    node: HTMLElement;
}
declare type ArgsSortCol = {
    sortCol: Column;
    sortAsc: boolean;
};
interface ArgsSort extends ArgsGrid {
    multiColumnSort: boolean;
    sortAsc?: boolean;
    sortCol?: Column;
    sortCols?: ArgsSortCol[];
}
interface ArgsSelectedRowsChange extends ArgsGrid {
    rows: number[];
    changedSelectedRows?: number[];
    changedUnselectedRows?: number[];
    previousSelectedRows?: number[];
    caller: any;
}
interface ArgsScroll extends ArgsGrid {
    scrollLeft: number;
    scrollTop: number;
}
interface ArgsCssStyle extends ArgsGrid {
    key: string;
    hash: CellStylesHash;
}
interface ArgsCell extends ArgsGrid {
    row: number;
    cell: number;
}
interface ArgsCellChange extends ArgsCell {
    item: any;
}
interface ArgsCellEdit extends ArgsCellChange {
    column: Column;
}
interface ArgsAddNewRow extends ArgsColumn {
    item: any;
}
interface ArgsEditorDestroy extends ArgsGrid {
    editor: Editor;
}
interface ArgsValidationError extends ArgsCell {
    editor: Editor;
    column: Column;
    cellNode: HTMLElement;
    validationResults: ValidationResult;
}

interface LayoutHost {
    bindAncestorScroll(el: HTMLElement): void;
    cleanUpAndRenderCells(range: ViewRange): void;
    getAvailableWidth(): number;
    getCellFromPoint(x: number, y: number): RowCell;
    getColumnCssRules(idx: number): {
        right: any;
        left: any;
    };
    getColumns(): Column[];
    getContainerNode(): HTMLElement;
    getDataLength(): number;
    getOptions(): GridOptions;
    getRowFromNode(rowNode: HTMLElement): number;
    getScrollDims(): {
        width: number;
        height: number;
    };
    getScrollLeft(): number;
    getScrollTop(): number;
    getViewportInfo(): ViewportInfo;
    renderRows(range: ViewRange): void;
}
interface LayoutEngine {
    appendCachedRow(row: number, rowNodeL: HTMLElement, rowNodeR: HTMLElement): void;
    afterHeaderColumnDrag(): void;
    afterSetOptions(args: GridOptions): void;
    applyColumnWidths(): void;
    beforeCleanupAndRenderCells(rendered: ViewRange): void;
    afterRenderRows(rendered: ViewRange): void;
    bindAncestorScrollEvents(): void;
    calcCanvasWidth(): number;
    updateHeadersWidth(): void;
    isFrozenRow(row: number): boolean;
    destroy(): void;
    getCanvasNodeFor(cell: number, row: number): HTMLElement;
    getCanvasNodes(): HTMLElement[];
    getCanvasWidth(): number;
    getRowFromCellNode(cellNode: HTMLElement, clientX: number, clientY: number): number;
    getFooterRowCols(): HTMLElement[];
    getFooterRowColsFor(cell: number): HTMLElement;
    getFooterRowColumn(cell: number): HTMLElement;
    getFrozenCols(): number;
    getFrozenRowOffset(row: number): number;
    getFrozenRows(): number;
    getHeaderCols(): HTMLElement[];
    getHeaderColsFor(cell: number): HTMLElement;
    getHeaderColumn(cell: number): HTMLElement;
    getHeaderRowCols(): HTMLElement[];
    getHeaderRowColsFor(cell: number): HTMLElement;
    getHeaderRowColumn(cell: number): HTMLElement;
    getScrollCanvasY(): HTMLElement;
    getScrollContainerX(): HTMLElement;
    getScrollContainerY(): HTMLElement;
    getTopPanelFor(arg0: number): HTMLElement;
    getTopPanelNodes(): HTMLElement[];
    getViewportNodeFor(cell: number, row: number): HTMLElement;
    getViewportNodes(): HTMLElement[];
    handleScrollH(): void;
    handleScrollV(): void;
    init(host: LayoutHost): void;
    layoutName: string;
    realScrollHeightChange(): void;
    /** this might be called before init, chicken egg situation */
    reorderViewColumns(viewCols: Column[], options?: GridOptions): Column[];
    resizeCanvas(): void;
    setPaneVisibility(): void;
    setScroller(): void;
    setOverflow(): void;
    updateCanvasWidth(): boolean;
}

interface GridOptions<TItem = any> {
    addNewRowCssClass?: string;
    alwaysAllowHorizontalScroll?: boolean;
    alwaysShowVerticalScroll?: boolean;
    asyncEditorLoadDelay?: number;
    asyncEditorLoading?: boolean;
    asyncPostCleanupDelay?: number;
    asyncPostRenderDelay?: number;
    autoEdit?: boolean;
    autoHeight?: boolean;
    cellFlashingCssClass?: string;
    cellHighlightCssClass?: string;
    columns?: Column<TItem>[];
    createPreHeaderPanel?: boolean;
    dataItemColumnValueExtractor?: (item: TItem, column: Column<TItem>) => void;
    defaultColumnWidth?: number;
    defaultFormatter?: ColumnFormatter<TItem>;
    editable?: boolean;
    editCommandHandler?: (item: TItem, column: Column<TItem>, command: EditCommand) => void;
    editorFactory?: EditorFactory;
    editorLock?: EditorLock;
    enableAddRow?: boolean;
    enableAsyncPostRender?: boolean;
    enableAsyncPostRenderCleanup?: boolean;
    enableCellNavigation?: boolean;
    enableCellRangeSelection?: boolean;
    enableColumnReorder?: boolean;
    enableRowReordering?: boolean;
    enableTabKeyNavigation?: boolean;
    enableTextSelectionOnCells?: boolean;
    explicitInitialization?: boolean;
    footerRowHeight?: number;
    forceFitColumns?: boolean;
    forceSyncScrolling?: boolean;
    forceSyncScrollInterval?: number;
    formatterFactory?: FormatterFactory;
    frozenBottom?: boolean;
    frozenColumns?: number;
    frozenRows?: number;
    fullWidthRows?: boolean;
    groupingPanel?: boolean;
    groupingPanelHeight?: number;
    groupTotalsFormatter?: (p1?: GroupTotals<TItem>, p2?: Column<TItem>, grid?: Grid<TItem>) => string;
    headerRowHeight?: number;
    jQuery?: JQueryStatic;
    leaveSpaceForNewRows?: boolean;
    layoutEngine?: LayoutEngine;
    minBuffer?: number;
    multiColumnSort?: boolean;
    multiSelect?: boolean;
    preHeaderPanelHeight?: number;
    renderAllCells?: boolean;
    rowHeight?: number;
    rtl?: boolean;
    selectedCellCssClass?: string;
    showCellSelection?: boolean;
    showColumnHeader?: boolean;
    showFooterRow?: boolean;
    showGroupingPanel?: boolean;
    showHeaderRow?: boolean;
    showPreHeaderPanel?: boolean;
    showTopPanel?: boolean;
    slickCompat?: boolean;
    suppressActiveCellChangeOnEdit?: boolean;
    syncColumnCellResize?: boolean;
    topPanelHeight?: number;
    useLegacyUI?: boolean;
    viewportClass?: string;
}
declare const gridDefaults: GridOptions;

declare class Grid<TItem = any> {
    private _absoluteColMinWidth;
    private _activeCanvasNode;
    private _activeCell;
    private _activeCellNode;
    private _activePosX;
    private _activeRow;
    private _activeViewportNode;
    private _cellCssClasses;
    private _cellHeightDiff;
    private _cellWidthDiff;
    private _cellNavigator;
    private _colById;
    private _colDefaults;
    private _colLeft;
    private _colRight;
    private _cols;
    private _columnCssRulesL;
    private _columnCssRulesR;
    private _currentEditor;
    private _data;
    private _editController;
    private _headerColumnWidthDiff;
    private _hEditorLoader;
    private _hPostRender;
    private _hPostRenderCleanup;
    private _hRender;
    private _ignoreScrollUntil;
    private _initColById;
    private _initCols;
    private _initialized;
    private _jQuery;
    private _jumpinessCoefficient;
    private _lastRenderTime;
    private _layout;
    private _numberOfPages;
    private _options;
    private _page;
    private _pageHeight;
    private _pageOffset;
    private _pagingActive;
    private _pagingIsLastPage;
    private _plugins;
    private _postProcessCleanupQueue;
    private _postProcessedRows;
    private _postProcessFromRow;
    private _postProcessGroupId;
    private _postProcessToRow;
    private _rowsCache;
    private _scrollDims;
    private _scrollLeft;
    private _scrollLeftPrev;
    private _scrollLeftRendered;
    private _scrollTop;
    private _scrollTopPrev;
    private _scrollTopRendered;
    private _selectedRows;
    private _selectionModel;
    private _serializedEditorValue;
    private _sortColumns;
    private _styleNode;
    private _stylesheet;
    private _tabbingDirection;
    private _uid;
    private _viewportInfo;
    private _vScrollDir;
    private _boundAncestorScroll;
    private _container;
    private _focusSink1;
    private _focusSink2;
    private _groupingPanel;
    readonly onActiveCellChanged: Event<ArgsCell, IEventData>;
    readonly onActiveCellPositionChanged: Event<ArgsGrid, IEventData>;
    readonly onAddNewRow: Event<ArgsAddNewRow, IEventData>;
    readonly onBeforeCellEditorDestroy: Event<ArgsEditorDestroy, IEventData>;
    readonly onBeforeDestroy: Event<ArgsGrid, IEventData>;
    readonly onBeforeEditCell: Event<ArgsCellEdit, IEventData>;
    readonly onBeforeFooterRowCellDestroy: Event<ArgsColumnNode, IEventData>;
    readonly onBeforeHeaderCellDestroy: Event<ArgsColumnNode, IEventData>;
    readonly onBeforeHeaderRowCellDestroy: Event<ArgsColumnNode, IEventData>;
    readonly onCellChange: Event<ArgsCellChange, IEventData>;
    readonly onCellCssStylesChanged: Event<ArgsCssStyle, IEventData>;
    readonly onClick: Event<ArgsCell, JQueryMouseEventObject>;
    readonly onColumnsReordered: Event<ArgsGrid, IEventData>;
    readonly onColumnsResized: Event<ArgsGrid, IEventData>;
    readonly onCompositeEditorChange: Event<ArgsGrid, IEventData>;
    readonly onContextMenu: Event<ArgsGrid, JQueryEventObject>;
    readonly onDblClick: Event<ArgsCell, JQueryMouseEventObject>;
    readonly onDrag: Event<ArgsGrid, JQueryEventObject>;
    readonly onDragEnd: Event<ArgsGrid, JQueryEventObject>;
    readonly onDragInit: Event<ArgsGrid, JQueryEventObject>;
    readonly onDragStart: Event<ArgsGrid, JQueryEventObject>;
    readonly onFooterRowCellRendered: Event<ArgsColumnNode, IEventData>;
    readonly onHeaderCellRendered: Event<ArgsColumnNode, IEventData>;
    readonly onHeaderClick: Event<ArgsColumn, IEventData>;
    readonly onHeaderContextMenu: Event<ArgsColumn, IEventData>;
    readonly onHeaderMouseEnter: Event<ArgsColumn, MouseEvent>;
    readonly onHeaderMouseLeave: Event<ArgsColumn, MouseEvent>;
    readonly onHeaderRowCellRendered: Event<ArgsColumnNode, IEventData>;
    readonly onKeyDown: Event<ArgsCell, JQueryKeyEventObject>;
    readonly onMouseEnter: Event<ArgsGrid, MouseEvent>;
    readonly onMouseLeave: Event<ArgsGrid, MouseEvent>;
    readonly onScroll: Event<ArgsScroll, IEventData>;
    readonly onSelectedRowsChanged: Event<ArgsSelectedRowsChange, IEventData>;
    readonly onSort: Event<ArgsSort, IEventData>;
    readonly onValidationError: Event<ArgsValidationError, IEventData>;
    readonly onViewportChanged: Event<ArgsGrid, IEventData>;
    constructor(container: JQuery | HTMLElement, data: any, columns: Column<TItem>[], options: GridOptions<TItem>);
    private bindAncestorScroll;
    init(): void;
    private hasFrozenColumns;
    private hasFrozenRows;
    registerPlugin(plugin: IPlugin): void;
    unregisterPlugin(plugin: IPlugin): void;
    getPluginByName(name: string): IPlugin;
    setSelectionModel(model: SelectionModel): void;
    getScrollBarDimensions(): {
        width: number;
        height: number;
    };
    getDisplayedScrollbarDimensions(): {
        width: number;
        height: number;
    };
    getAbsoluteColumnMinWidth(): number;
    getSelectionModel(): SelectionModel;
    private colIdOrIdxToCell;
    getCanvasNode(columnIdOrIdx?: string | number, row?: number): HTMLElement;
    getCanvases(): JQuery | HTMLElement[];
    getActiveCanvasNode(e?: IEventData): HTMLElement;
    setActiveCanvasNode(e?: IEventData): void;
    getViewportNode(columnIdOrIdx?: string | number, row?: number): HTMLElement;
    private getViewports;
    getActiveViewportNode(e?: IEventData): HTMLElement;
    setActiveViewportNode(e?: IEventData): void;
    private getAvailableWidth;
    private updateCanvasWidth;
    private unbindAncestorScrollEvents;
    updateColumnHeader(columnId: string, title?: string, toolTip?: string): void;
    getHeader(): HTMLElement;
    getHeaderColumn(columnIdOrIdx: string | number): HTMLElement;
    getGroupingPanel(): HTMLElement;
    getPreHeaderPanel(): HTMLElement;
    getHeaderRow(): HTMLElement;
    getHeaderRowColumn(columnIdOrIdx: string | number): HTMLElement;
    getFooterRow(): HTMLElement;
    getFooterRowColumn(columnIdOrIdx: string | number): HTMLElement;
    private createColumnFooters;
    private formatGroupTotal;
    private createColumnHeaders;
    private setupColumnSort;
    private setupColumnReorder;
    private setupColumnResize;
    private setOverflow;
    private measureCellPaddingAndBorder;
    private createCssRules;
    private getColumnCssRules;
    private removeCssRules;
    destroy(): void;
    private trigger;
    getEditorLock(): EditorLock;
    getEditController(): EditController;
    getColumnIndex(id: string): number;
    getInitialColumnIndex(id: string): number;
    autosizeColumns(): void;
    private applyColumnHeaderWidths;
    setSortColumn(columnId: string, ascending: boolean): void;
    setSortColumns(cols: ColumnSort[]): void;
    getSortColumns(): ColumnSort[];
    private handleSelectedRangesChanged;
    getColumns(): Column<TItem>[];
    getInitialColumns(): Column<TItem>[];
    private updateViewColLeftRight;
    private setInitialCols;
    setColumns(columns: Column<TItem>[]): void;
    getOptions(): GridOptions<TItem>;
    setOptions(args: GridOptions<TItem>, suppressRender?: boolean, suppressColumnSet?: boolean, suppressSetOverflow?: boolean): void;
    private validateAndEnforceOptions;
    private viewOnRowCountChanged;
    private viewOnRowsChanged;
    private viewOnDataChanged;
    private bindToData;
    private unbindFromData;
    setData(newData: any, scrollToTop?: boolean): void;
    getData(): any;
    getDataLength(): number;
    private getDataLengthIncludingAddNew;
    getDataItem(i: number): TItem;
    getTopPanel(): HTMLElement;
    setTopPanelVisibility(visible: boolean): void;
    setColumnHeaderVisibility(visible: boolean, animate?: boolean): void;
    setFooterRowVisibility(visible: boolean): void;
    setGroupingPanelVisibility(visible: boolean): void;
    setPreHeaderPanelVisibility(visible: boolean): void;
    setHeaderRowVisibility(visible: boolean): void;
    getContainerNode(): HTMLElement;
    getUID(): string;
    private getRowTop;
    private getRowFromPosition;
    private scrollTo;
    getFormatter(row: number, column: Column<TItem>): ColumnFormatter<TItem>;
    private getEditor;
    private getDataItemValueForColumn;
    private appendRowHtml;
    private appendCellHtml;
    private cleanupRows;
    invalidate(): void;
    invalidateAllRows(): void;
    private queuePostProcessedRowForCleanup;
    private queuePostProcessedCellForCleanup;
    private removeRowFromCache;
    invalidateRows(rows: number[]): void;
    invalidateRow(row: number): void;
    updateCell(row: number, cell: number): void;
    updateRow(row: number): void;
    private calcViewportSize;
    resizeCanvas: () => void;
    updatePagingStatusFromView(pagingInfo: {
        pageSize: number;
        pageNum: number;
        totalPages: number;
    }): void;
    private updateRowCount;
    /**
     * @param viewportTop optional viewport top
     * @param viewportLeft optional viewport left
     * @returns viewport range
     */
    getViewport(viewportTop?: number, viewportLeft?: number): ViewRange;
    getVisibleRange(viewportTop?: number, viewportLeft?: number): ViewRange;
    getRenderedRange(viewportTop?: number, viewportLeft?: number): ViewRange;
    private ensureCellNodesInRowsCache;
    private cleanUpCells;
    private cleanUpAndRenderCells;
    private renderRows;
    private startPostProcessing;
    private startPostProcessingCleanup;
    private invalidatePostProcessingResults;
    private updateRowPositions;
    private updateGrandTotals;
    private render;
    private handleHeaderRowScroll;
    private handleFooterRowScroll;
    private handleMouseWheel;
    private handleScroll;
    private asyncPostProcessRows;
    private asyncPostProcessCleanupRows;
    private updateCellCssStylesOnRenderedRows;
    addCellCssStyles(key: string, hash: CellStylesHash): void;
    removeCellCssStyles(key: string): void;
    setCellCssStyles(key: string, hash: CellStylesHash): void;
    getCellCssStyles(key: string): CellStylesHash;
    flashCell(row: number, cell: number, speed?: number): void;
    private handleDragInit;
    private handleDragStart;
    private handleDrag;
    private handleDragEnd;
    private handleKeyDown;
    private handleClick;
    private handleContextMenu;
    private handleDblClick;
    private handleHeaderMouseEnter;
    private handleHeaderMouseLeave;
    private handleHeaderContextMenu;
    private handleHeaderClick;
    private handleMouseEnter;
    private handleMouseLeave;
    private cellExists;
    getCellFromPoint(x: number, y: number): {
        row: number;
        cell: number;
    };
    getCellFromNode(cellNode: Element): number;
    getColumnFromNode(cellNode: Element): Column<TItem>;
    getRowFromNode(rowNode: Element): number;
    getCellFromEvent(e: any): {
        row: number;
        cell: number;
    };
    getCellNodeBox(row: number, cell: number): {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    resetActiveCell(): void;
    focus(): void;
    private setFocus;
    scrollCellIntoView(row: number, cell: number, doPaging?: boolean): void;
    scrollColumnIntoView(cell: number): void;
    internalScrollColumnIntoView(left: number, right: number): void;
    private setActiveCellInternal;
    clearTextSelection(): void;
    private isCellPotentiallyEditable;
    private makeActiveCellNormal;
    editActiveCell(editor?: Editor): void;
    private makeActiveCellEditable;
    private commitEditAndSetFocus;
    private cancelEditAndSetFocus;
    private getActiveCellPosition;
    getGridPosition(): Position;
    private handleActiveCellPositionChange;
    getCellEditor(): Editor;
    getActiveCell(): RowCell;
    getActiveCellNode(): HTMLElement;
    scrollActiveCellIntoView(): void;
    scrollRowIntoView(row: number, doPaging?: boolean): void;
    scrollRowToTop(row: number): void;
    private scrollPage;
    navigatePageDown(): void;
    navigatePageUp(): void;
    navigateTop(): void;
    navigateBottom(): void;
    navigateToRow(row: number): boolean;
    getColspan(row: number, cell: number): number;
    navigateRight(): boolean;
    navigateLeft(): boolean;
    navigateDown(): boolean;
    navigateUp(): boolean;
    navigateNext(): boolean;
    navigatePrev(): boolean;
    navigateRowStart(): boolean;
    navigateRowEnd(): boolean;
    /**
     * @param {string} dir Navigation direction.
     * @return {boolean} Whether navigation resulted in a change of active cell.
     */
    navigate(dir: string): boolean;
    getCellNode(row: number, cell: number): HTMLElement;
    setActiveCell(row: number, cell: number): void;
    setActiveRow(row: number, cell: number, suppressScrollIntoView?: boolean): void;
    private canCellBeActive;
    canCellBeSelected(row: number, cell: number): any;
    gotoCell(row: number, cell: number, forceEdit?: boolean): void;
    commitCurrentEdit(): boolean;
    private cancelCurrentEdit;
    private rowsToRanges;
    getSelectedRows(): number[];
    setSelectedRows(rows: number[]): void;
}

interface Column<TItem = any> {
    asyncPostRender?: AsyncPostRender<TItem>;
    asyncPostRenderCleanup?: AsyncPostCleanup<TItem>;
    behavior?: any;
    cannotTriggerInsert?: boolean;
    cssClass?: string;
    defaultSortAsc?: boolean;
    editor?: Editor;
    field: string;
    frozen?: boolean;
    focusable?: boolean;
    footerCssClass?: string;
    formatter?: ColumnFormatter<TItem>;
    groupTotalsFormatter?: (p1?: GroupTotals<TItem>, p2?: Column<TItem>, grid?: Grid<TItem>) => string;
    headerCssClass?: string;
    id?: string;
    maxWidth?: any;
    minWidth?: number;
    name?: string;
    nameIsHtml?: boolean;
    previousWidth?: number;
    referencedFields?: string[];
    rerenderOnResize?: boolean;
    resizable?: boolean;
    selectable?: boolean;
    sortable?: boolean;
    sortOrder?: number;
    toolTip?: string;
    validator?: (value: any) => ValidationResult;
    visible?: boolean;
    width?: number;
}
declare const columnDefaults: Partial<Column>;
interface ColumnMetadata<TItem = any> {
    colspan: number | '*';
    formatter?: ColumnFormatter<TItem>;
}
interface ColumnSort {
    columnId: string;
    sortAsc?: boolean;
}
interface ItemMetadata<TItem = any> {
    columns?: {
        [key: string]: ColumnMetadata<TItem>;
    };
    formatter?: ColumnFormatter<TItem>;
}

declare const BasicLayout: {
    new (): LayoutEngine;
};

declare const FrozenLayout: {
    new (): LayoutEngine;
};

export { ArgsAddNewRow, ArgsCell, ArgsCellChange, ArgsCellEdit, ArgsColumn, ArgsColumnNode, ArgsCssStyle, ArgsEditorDestroy, ArgsGrid, ArgsScroll, ArgsSelectedRowsChange, ArgsSort, ArgsSortCol, ArgsValidationError, AsyncPostCleanup, AsyncPostRender, BasicLayout, CellStylesHash, Column, ColumnFormatter, ColumnMetadata, ColumnSort, EditCommand, EditController, Editor, EditorFactory, EditorLock, EditorOptions, Event, EventData, EventHandler, FormatterFactory, FormatterResult, FrozenLayout, GlobalEditorLock, Grid, GridOptions, Group, GroupTotals, H, Handler, IEventData, IPlugin, ItemMetadata, LayoutEngine, LayoutHost, NonDataRow, Position, Range, RowCell, SelectionModel, ValidationResult, ViewRange, ViewportInfo, addClass, applyFormatterResultToCellNode, attrEncode, columnDefaults, defaultFormatter, disableSelection, gridDefaults, htmlEncode, keyCode, patchEvent, preClickClassName, removeClass, spacerDiv };
