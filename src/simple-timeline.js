import "./simple-timeline.scss"

'use strict';

/**
 * SimpleTimeline
 */
export default class SimpleTimeline {

    /**
     * 日付昇順（デフォルト）
     * @param {*} i1 
     * @param {*} i2 
     * @returns 
     */
    static itemDateAscComparator = (i1, i2) => (SimpleTimeline.getItemDate(i1) > SimpleTimeline.getItemDate(i2) ? 1 : -1);
    /**
     * 日付降順
     * @param {}} i1 
     * @param {*} i2 
     * @returns 
     */
    static itemDateDescComparator = (i1, i2) => SimpleTimeline.itemDateAscComparator(i1, i2) * -1;

    /**
     * デフォルトオプション
     */
    static defaultOption = {
        debug: false,
        linePosition: "left",
        // Renders a line reflecting the state of the timeline item.
        progress: false,
        // Invertes the progress of the line.
        progressInverted: false,
        // Set the state of a timeline item by comparing its date with the current date.
        autoProgress: false,
        // Label to display when the item's date is the same as the current date.
        currentLabel: null,
        header: null,
        footer: null,

        dateFormatter: (date) => (date == null ? "" : date.toLocaleDateString()),
        itemStateFactory: (item, renderDate = null) => {
            if (!item) {
                return "";
            }

            const itemDate = SimpleTimeline.getItemDate(item);
            const isSameDay = SimpleTimeline.isSameDay(itemDate, renderDate != null ? renderDate : new Date());

            if (isSameDay) {
                return "current";
            } else if (itemDate.getTime() < renderDate.getTime()) {
                return "passed";
            }

            return "schedule";
        },
        itemComparator: SimpleTimeline.itemDateAscComparator,
    };

    static defaultItemOption = {
        position: "right",
        backgroundColor: null,
        borderColor: null,
        fontColor: null,
    }

    static globalOption = {};


    static setGlobalOption(globalOption) {
        if (!globalOption) {
            SimpleTimeline.globalOption = {};
            return;
        }

        SimpleTimeline.globalOption = globalOption;
    }

    static isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    static isSameDayHour(d1, d2) {
        return SimpleTimeline.isSameDay(d1, d2) && d1.getHours() === d2.getHours();
    }

    static getItemDate(timelineItem) {
        let itemDate = timelineItem.date;
        if (!(itemDate instanceof Date)) {
            itemDate = new Date(itemDate.replace(/-/g, "/"));
        }
        return itemDate;
    }



    /**
     * Container element
     */
    container;

    /**
     * Timeline element
     */
    timeline;

    /**
     * Timeline item template element
     */
    itemTemplate;

    /**
     * Timeline option object
     */
    option = {};

    /**
     * Timeline items array
     */
    items = [];

    /**
     * Initializes simple-timeline
     * 
     * @param {*} container 
     * @param {*} args 
     */
    constructor(container, args) {

        this.container = container;

        if (args != null) {
            if (args.option != null) {
                this.option = args.option;
            }
            if (args.items != null) {
                this.items = args.items;
            }
        }

        this.option = this.#getMergeOption(this.option);

        if ('content' in document.createElement('template')) {
            const itemTemplates = this.container.getElementsByTagName("template");
            this.itemTemplate = (itemTemplates && itemTemplates.length > 0) ? itemTemplates[0] : null;
        }

        this.initializeStyleSheet();
        this.renderTimeline();
    }

    initializeStyleSheet() {
        //ドキュメントスタイルの取得
        const sheets = document.styleSheets;
        const sheet = sheets[sheets.length - 1];

        if (this.option.currentLabel != null) {
            //スタイルルールの追加
            const style = " .st-timeline .st-item-container.st-current .st-datetime::before { content: '" + this.option.currentLabel + "' !important }";
            const tlContainerId = this.container.id;
            if (tlContainerId) {
                sheet.insertRule("#" + tlContainerId + style, sheet.cssRules.length);
                return;
            }

            sheet.insertRule(style, sheet.cssRules.length);
        }

    }

    /**
     * Clears timeline item elements
     */
    clearItems() {

        if (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        this.timeline = document.createElement("div");
        this.#addClassName(this.timeline, "st-timeline")

        switch (this.option.linePosition) {
            case 'right':
                this.#addClassName(this.timeline, "st-right-line");
                break;
            case 'center':
                this.#addClassName(this.timeline, "st-center-line");
                break;
            default:
                this.#addClassName(this.timeline, "st-left-line");
        }

        if (!this.option.progress) {
            this.#addClassName(this.timeline, "st-no-progress");
        }

        if (this.option.progressInverted) {
            this.#addClassName(this.timeline, "st-inverted-progress");
        }

        this.container.appendChild(this.timeline);
    }

    /**
     * Renders timeline item elements
     */
    renderTimeline() {

        this.clearItems();

        // render header
        if (this.option.header) {
            const headerContainer = document.createElement("div");
            this.#addClassName(headerContainer, "st-header-container");

            const header = document.createElement("span");
            this.#addClassName(header, "st-header");
            header.innerHTML = this.option.header.label;

            headerContainer.appendChild(header);

            this.timeline.appendChild(headerContainer);
        }

        // render timeline items
        const currentDate = this.option.autoProgress ? new Date() : null;
        const items = this.getItems();

        if (items) {
            items.sort(this.option.itemComparator);
        }

        for (var i = 0; i < items.length; i++) {
            const timelineItem = items[i];
            timelineItem["renderDate"] = currentDate;
            this.#appendItem(timelineItem);
        }

        // render footer
        if (this.option.footer) {
            const footerContainer = document.createElement("div");
            this.#addClassName(footerContainer, "st-footer-container");

            const footer = document.createElement("span");
            this.#addClassName(footer, "st-footer");
            footer.innerHTML = this.option.footer.label;

            footerContainer.appendChild(footer);

            this.timeline.appendChild(footerContainer);
        }
    }

    createItemContainer(timelineItem) {
        const itemDate = SimpleTimeline.getItemDate(timelineItem);
        const itemOption = this.#getItemOption(timelineItem);


        const itemContainerElm = document.createElement("div");
        this.#addClassName(itemContainerElm, "st-item-container");
        itemContainerElm.setAttribute("data-st-date", itemDate.toISOString());


        const progressWraper = document.createElement("div");
        this.#addClassName(progressWraper, "st-progress-wraper");
        itemContainerElm.appendChild(progressWraper);

        const lineElm = document.createElement("div");
        this.#addClassName(lineElm, "st-line");
        progressWraper.appendChild(lineElm);

        const linePointElm = document.createElement("div");
        this.#addClassName(linePointElm, "st-point");
        progressWraper.appendChild(linePointElm);



        const itemWraperElm = document.createElement("div");
        this.#addClassName(itemWraperElm, "st-item-wraper");

        if (this.option.linePosition == "center") {
            if (itemOption.position == "left") {
                this.#addClassName(itemWraperElm, "st-left");
            } else {
                this.#addClassName(itemWraperElm, "st-right");
            }
        }

        // 状態
        let itemState = "";
        if (this.option.autoProgress) {
            itemState = this.option.itemStateFactory(timelineItem, timelineItem["renderDate"]);
        } else {
            itemState = timelineItem.state;
        }

        if ("passed" == itemState) {
            this.#addClassName(itemContainerElm, "st-passed");
        } else if ("current" == itemState) {
            this.#addClassName(itemContainerElm, "st-current");
        } else {
            this.#addClassName(itemContainerElm, "st-schedule");
        }




        if (this.itemTemplate) {
            const itemElm = this.itemTemplate.content.cloneNode(true);
            this.#addClassName(itemElm, "st-item");

            // 日時
            const datetimeElm = itemElm.querySelector("[data-st-datetime]");
            if (datetimeElm) {
                const dateFormatter = this.option.dateFormatter ?? this.defaultDateFormatter;
                datetimeElm.innerHTML = dateFormatter(itemDate);
                // this.#addClassName(datetimeElm, "st-datetime");
            }

            // タイトル
            const titleElm = itemElm.querySelector("[data-st-title]");
            if (titleElm) {
                const isEmptyTitle = this.#isEmpty(timelineItem, "title");
                titleElm.innerHTML = isEmptyTitle ? "" : timelineItem.title;
                // this.#addClassName(titleElm, "st-title");
            }

            // 内容
            const contentElm = itemElm.querySelector("[data-st-content]");
            if (contentElm) {
                const isEmptyContent = this.#isEmpty(timelineItem, "content");
                contentElm.innerHTML = isEmptyContent ? "" : timelineItem.content;
                // this.#addClassName(contentElm, "st-content");
            }

            itemWraperElm.appendChild(itemElm);
        } else {
            const itemElm = document.createElement("div");
            this.#addClassName(itemElm, "st-item");

            if (itemOption.backgroundColor != null) {
                itemElm.style.background = itemOption.backgroundColor;
                itemElm.style.borderColor = itemOption.backgroundColor;
            }
            if (itemOption.borderColor != null) {
                itemElm.style.border = "solid 2px " + itemOption.borderColor;
            }
            if (itemOption.fontColor != null) {
                itemElm.style.color = itemOption.fontColor;
            }


            // 日時
            const datetimeElm = document.createElement("p");
            const dateFormatter = this.option.dateFormatter ?? this.defaultDateFormatter;
            datetimeElm.innerHTML = dateFormatter(itemDate);
            this.#addClassName(datetimeElm, "st-datetime");

            // タイトル
            const titleElm = document.createElement("p");
            const isEmptyTitle = this.#isEmpty(timelineItem, "title");
            titleElm.innerHTML = isEmptyTitle ? "" : timelineItem.title;
            this.#addClassName(titleElm, "st-title");

            if (itemOption.borderColor != null) {
                titleElm.style.borderColor = itemOption.borderColor;
            }

            // 内容
            const contentElm = document.createElement("div");
            const isEmptyContent = this.#isEmpty(timelineItem, "content");
            contentElm.innerHTML = isEmptyContent ? "" : timelineItem.content;
            this.#addClassName(contentElm, "st-content");

            itemElm.appendChild(datetimeElm);

            if (!isEmptyTitle || !isEmptyContent) {
                itemElm.appendChild(titleElm);
                itemElm.appendChild(contentElm);
            }

            itemWraperElm.appendChild(itemElm);
        }


        itemContainerElm.appendChild(itemWraperElm);

        timelineItem["refElm"] = itemContainerElm;

        return itemContainerElm;
    }

    insertItem(timelineItem) {
        const itemContainerElm = this.createItemContainer(timelineItem);
        const itemDate = SimpleTimeline.getItemDate(timelineItem);

        const items = this.getItems();

        var beforeItem = null;
        for (var i = 0; i < items.length; i++) {
            const createdItem = items[i];
            const createdItemDate = SimpleTimeline.getItemDate(createdItem);

            if (createdItemDate > itemDate) {
                if (beforeItem == null) {
                    this.timeline.appendChild(itemContainerElm);
                } else {
                    beforeItem.after(itemContainerElm);
                }

                items.splice(i, 0, timelineItem);
                break;
            }

            beforeItem = createdItem["refElm"];
        }

        if (!items.includes(timelineItem)) {
            this.timeline.appendChild(itemContainerElm);
            items.push(timelineItem);
        }

    }


    /**
     * Gets the timeline item array
     * @returns 
     */
    getItems() {
        return this.items;
    }

    /**
     * Sets timeline items
     * 
     * @param {*} items 
     */
    setItems(items) {
        this.items = items;
    }

    /**
     * Gets the timeline option object
     * @returns 
     */
    getOption() {
        return this.option;
    }

    /**
     * Sets option object
     * 
     * @param {*} option 
     */
    setOption(option) {
        this.option = this.#getMergeOption(option);
    }

    /**
     * Appends timeline item
     * 
     * @param {*} timelineItem 
     * @returns 
     */
     #appendItem(timelineItem, currentDate = null) {

        const itemContainerElm = this.createItemContainer(timelineItem, currentDate);
        this.timeline.appendChild(itemContainerElm);

        return itemContainerElm;
    }


    #getItemOption(timelineItem) {
        let merged = {}
        merged = Object.assign(merged, SimpleTimeline.defaultItemOption);

        if (this.#hasProperty(timelineItem, "option")) {
            merged = Object.assign(merged, timelineItem.option);
        }

        return merged;
    }

    #hasProperty(obj, propName) {
        if (obj == null) {
            return false;
        }

        return Object.prototype.hasOwnProperty.call(obj, propName)
    }

    #hasPropertyValue(obj, propName) {
        if (!this.#hasProperty(obj, propName)) {
            return false;
        }

        const value = obj[propName];
        return value !== undefined || value !== null;
    }

    #isEmpty(obj, propName) {
        if (!this.#hasPropertyValue(obj, propName)) {
            return true;
        }

        return "" == obj[propName];
    }


    #getMergeOption(priorityOpition) {
        let merged = {};
        merged = Object.assign(merged, SimpleTimeline.defaultOption);
        merged = Object.assign(merged, SimpleTimeline.globalOption);
        merged = Object.assign(merged, priorityOpition);
        return merged;
    }

    #addClassName(element, className) {
        if (element) {

            if (element.classList) {
                element.classList.add(className);
            } else {
                element.className = "className";
            }

        }
    }
}
