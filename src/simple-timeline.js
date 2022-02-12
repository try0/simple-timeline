import "./simple-timeline.scss"

'use strict';

/**
 * SimpleTimeline
 */
export default class SimpleTimeline {

    static defaultOption = {
        debug: false,
        // Renders a line reflecting the state of the timeline item.
        progress: false,
        // Invertes the progress of the line.
        progressInverted: false,
        // Set the state of a timeline item by comparing its date with the current date.
        autoProgress: false,
        dateFormatter: (date) => date.toLocaleDateString(),
        // Label to display when the item's date is the same as the current date.
        currentLabel: null,
        header: null,
        footer: null
    };

    static defaultItemOption = {
        backgroundColor: null,
        borderColor: null,
        fontColor: null,
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
            sheet.insertRule(
                ".st-timeline .st-item-container.st-current .st-datetime::before { content: '" + this.option.currentLabel + "' !important }",
                sheet.cssRules.length
            );
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
            this.#appendItem(timelineItem, currentDate);
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

    createItemContainer(timelineItem, currentDate = null) {
        const itemDate = this.#getItemDate(timelineItem);

        const itemContainerElm = document.createElement("div");
        itemContainerElm.className = "st-item-container";

        itemContainerElm.setAttribute("data-st-date", itemDate.toISOString());

        if (this.option.autoProgress && currentDate != null) {
            if (itemDate.getTime() < currentDate.getTime()) {
                itemContainerElm.classList.add("st-passed");
            }
            if (this.isSameDay(itemDate, currentDate)) {
                itemContainerElm.classList.add("st-current");
            }

        } else {

            if ("passed" == timelineItem.state) {
                itemContainerElm.classList.add("st-passed");
            }

            if ("current" == timelineItem.state) {
                itemContainerElm.classList.add("st-current");
            }
        }


        const lineElm = document.createElement("div");
        lineElm.className = "st-line";
        itemContainerElm.appendChild(lineElm);

        const linePointElm = document.createElement("div");
        linePointElm.className = "st-point ";
        itemContainerElm.appendChild(linePointElm);

        const itemWraperElm = document.createElement("div");
        itemWraperElm.className = "st-item-wraper";

        const itemElm = document.createElement("div");
        itemElm.className = "st-item";
        itemWraperElm.appendChild(itemElm);

        const itemOption = this.#getItemOption(timelineItem);
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
        const itemDate = this.#getItemDate(timelineItem);

        const items = this.getItems();

        var beforeItem = null;
        for (var i = 0; i < items.length; i++) {
            const createdItem = items[i];
            const createdItemDate = this.#getItemDate(createdItem);

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

    isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
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

    #getItemDate(timelineItem) {
        let itemDate = timelineItem.date;
        if (!(itemDate instanceof Date)) {
            itemDate = new Date(itemDate);
        }
        return itemDate;
    }

    #getMergeOption(priorityOpition) {
        let merged = {};
        merged = Object.assign(merged, SimpleTimeline.defaultOption);
        merged = Object.assign(merged, priorityOpition);
        return merged;
    }

    #sortItemsOrderByDate(timelineItems) {
        if (timelineItems) {
            timelineItems.sort((i1, i2) => (this.#getItemDate(i1) > this.#getItemDate(i2) ? 1 : -1));
        }
        return timelineItems;
    }

}
