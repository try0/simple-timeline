import "./simple-timeline.scss"

'use strict';

/**
 * SimpleTimeline
 */
export default class SimpleTimeline {

    /**
     * Container element
     */
    container;

    /**
     * Timeline element
     */
    timeline;

    /**
     * Timeline setting object
     */
    setting = {
        progress: true,
        progressInverted: false,
    };

    /**
     * Timeline items array
     */
    timelineItems = [];

    /**
     * Initializes simple-timeline
     * 
     * @param {*} container 
     * @param {*} args 
     */
    constructor(container, args) {
        this.container = container;

        if (args != null) {
            if (args.setting != null) {
                this.setting = args.setting;
            }
            if (args.timelineItems != null) {
                this.timelineItems = args.timelineItems;
            }
        }

        this.renderTimeline();
    }


    /**
     * Clears timeline item elements
     */
    clearTimelineItems() {

        if (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        this.timeline = document.createElement("div");
        this.timeline.className = "st-timeline";

        if (this.setting.progress != null && !this.setting.progress) {
            this.timeline.classList.add("st-no-progress");
        }

        if (this.setting.progressInverted) {
            this.timeline.classList.add("st-inverted-progress");
        }

        this.container.appendChild(this.timeline);
    }

    /**
     * Renders timeline item elements
     */
    renderTimeline() {

        this.clearTimelineItems();

        var timelineItems = this.getTimelineItems();
        for (var i = 0; i < timelineItems.length; i++) {
            const timelineItem = timelineItems[i];

            var itemContainerElm = this.appendItem(timelineItem);
        }
    }

    /**
     * Appends timeline item
     * 
     * @param {*} timelineItem 
     * @returns 
     */
    appendItem(timelineItem) {
        var itemContainerElm = document.createElement("div");
        itemContainerElm.className = "st-item-container";

        if (timelineItem.passed) {
            itemContainerElm.classList.add("st-passed");
        }

        if (timelineItem.current) {
            itemContainerElm.classList.add("st-current");
        }

        var lineElm = document.createElement("div");
        lineElm.className = "st-line";
        itemContainerElm.appendChild(lineElm);

        var linePointElm = document.createElement("div");
        linePointElm.className = "st-point ";
        itemContainerElm.appendChild(linePointElm);

        var itemWraperElm = document.createElement("div");
        itemWraperElm.className = "st-item-wraper ";

        var itemElm = document.createElement("div");
        itemElm.className = "st-item ";
        itemWraperElm.appendChild(itemElm);

        var datetimeElm = document.createElement("p");
        datetimeElm.innerHTML = timelineItem.datetime;
        datetimeElm.className = "st-datetime";


        var titleElm = document.createElement("p");
        titleElm.innerHTML = timelineItem.title;
        titleElm.className = "st-title";

        var contentElm = document.createElement("div");
        contentElm.innerHTML = timelineItem.content;
        contentElm.className = "st-content"

        itemElm.appendChild(datetimeElm);
        itemElm.appendChild(titleElm);
        itemElm.appendChild(contentElm);

        itemContainerElm.appendChild(itemWraperElm);
        this.timeline.appendChild(itemContainerElm);

        return itemContainerElm;
    }

    /**
     * Gets the timeline item array
     * @returns 
     */
    getTimelineItems() {
        return this.timelineItems;
    }

    /**
     * Sets timeline items
     * 
     * @param {*} timelineItems 
     */
    setTimelineItems(timelineItems) {
        this.timelineItems = timelineItems;
    }

    /**
     * Gets the timeline setting object
     * @returns 
     */
    getSetting() {
        return this.setting;
    }

    /**
     * Sets setting object
     * 
     * @param {*} setting 
     */
    setSetting(setting) {
        this.setting = setting;
    }

}
