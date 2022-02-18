import "./simple-timeline.scss"

'use strict';

/**
 * SimpleTimeline
 */
export default class SimpleTimeline {

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
                return "passed"
            }
             
            return "schedule";
        },
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
        this.timeline.className = "st-timeline";

        switch (this.option.linePosition) {
            case 'right':
                this.timeline.classList.add("st-right-line");
                break;
            case 'center':
                this.timeline.classList.add("st-center-line");
                break;
            default:
                this.timeline.classList.add("st-left-line");
        }

        if (!this.option.progress) {
            this.timeline.classList.add("st-no-progress");
        }

        if (this.option.progressInverted) {
            this.timeline.classList.add("st-inverted-progress");
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
            headerContainer.className = "st-header-container";

            const header = document.createElement("span");
            header.className = "st-header";
            header.innerHTML = this.option.header.label;

            headerContainer.appendChild(header);

            this.timeline.appendChild(headerContainer);
        }

        // render timeline items
        const currentDate = this.option.autoProgress ? new Date() : null;
        const items = this.getItems();

        this.#sortItemsOrderByDate(items);

        for (var i = 0; i < items.length; i++) {
            const timelineItem = items[i];
            timelineItem["renderDate"] = currentDate;
            this.#appendItem(timelineItem);
        }

        // render footer
        if (this.option.footer) {
            const footerContainer = document.createElement("div");
            footerContainer.className = "st-footer-container";

            const footer = document.createElement("span");
            footer.className = "st-footer";
            footer.innerHTML = this.option.footer.label;

            footerContainer.appendChild(footer);

            this.timeline.appendChild(footerContainer);
        }
    }

    createItemContainer(timelineItem) {
        const itemDate = SimpleTimeline.getItemDate(timelineItem);
        const itemOption = this.#getItemOption(timelineItem);


        const itemContainerElm = document.createElement("div");
        itemContainerElm.className = "st-item-container";
        itemContainerElm.setAttribute("data-st-date", itemDate.toISOString());


        const progressWraper = document.createElement("div");
        progressWraper.className = "st-progress-wraper";
        itemContainerElm.appendChild(progressWraper);

        const lineElm = document.createElement("div");
        lineElm.className = "st-line";
        progressWraper.appendChild(lineElm);

        const linePointElm = document.createElement("div");
        linePointElm.className = "st-point ";
        progressWraper.appendChild(linePointElm);



        const itemWraperElm = document.createElement("div");
        itemWraperElm.className = "st-item-wraper";

        if (this.option.linePosition == "center") {
            if (itemOption.position == "left") {
                itemWraperElm.classList.add("st-left");
            } else {
                itemWraperElm.classList.add("st-right");
            }
        }



        const itemElm = document.createElement("div");
        itemElm.className = "st-item";
        itemWraperElm.appendChild(itemElm);


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



        // 状態
        let itemState = "";
        if (this.option.autoProgress) {
            itemState = this.option.itemStateFactory(timelineItem, timelineItem["renderDate"]);
        } else {
            itemState = timelineItem.state;
        }


        if ("passed" == itemState) {
            itemContainerElm.classList.add("st-passed");
        }
        else if ("current" == itemState) {
            itemContainerElm.classList.add("st-current");
        }
        else {
            itemContainerElm.classList.add("st-schedule");
        }

        const datetimeElm = document.createElement("p");

        const dateFormatter = this.option.dateFormatter ?? this.defaultDateFormatter;
        datetimeElm.innerHTML = dateFormatter(itemDate);
        datetimeElm.className = "st-datetime";


        const titleElm = document.createElement("p");
        const isEmptyTitle = this.#isEmpty(timelineItem, "title");
        titleElm.innerHTML = isEmptyTitle ? "" : timelineItem.title;
        titleElm.className = "st-title";

        if (itemOption.borderColor != null) {
            titleElm.style.borderColor = itemOption.borderColor;
        }

        const contentElm = document.createElement("div");
        const isEmptyContent = this.#isEmpty(timelineItem, "content");
        contentElm.innerHTML = isEmptyContent ? "" : timelineItem.content;
        contentElm.className = "st-content"

        itemElm.appendChild(datetimeElm);

        if (!isEmptyTitle || !isEmptyContent) {
            itemElm.appendChild(titleElm);
            itemElm.appendChild(contentElm);
        }

        itemContainerElm.appendChild(itemWraperElm);

        timelineItem["refElm"] = itemContainerElm;

        return itemContainerElm;
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

    #sortItemsOrderByDate(timelineItems) {
        if (timelineItems) {
            timelineItems.sort((i1, i2) => (SimpleTimeline.getItemDate(i1) > SimpleTimeline.getItemDate(i2) ? 1 : -1));
        }
        return timelineItems;
    }

}
