
import { default as SimpleTimeline } from "../src/simple-timeline"


test("デフォルトオプションが反映されるかいなか", () => {

    document.body.innerHTML = "<div id=\"timeline-container\"></div>";

    var stl = new SimpleTimeline(document.getElementById("timeline-container"), {
        option: {
        },
        items: [
            {
                date: "2022-01-01",
                title: "Item1Title",
                content: "Item1Content"
            }
        ]
    });

    var option = stl.getOption();
    for (const key in SimpleTimeline.defaultOption) {
        expect(option[key]).toBe(SimpleTimeline.defaultOption[key]);
    }
});

test("グローバルオプションが反映されるかいなか", () => {

    const style = window.document.createElement('style');
    window.document.head.appendChild(style);
    document.body.innerHTML = "<div id=\"timeline-container\"></div>";

    const globalOption = {
        debug: true,
        linePosition: "right",
        progress: true,
        progressInverted: true,
        autoProgress: true,
        currentLabel: "testGlobalCurrentLabel",
        header: { label: "testGlobal" },
        footer: { label: "testGlobal" },
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
        itemComparator: SimpleTimeline.itemDateDescComparator,
    };

    SimpleTimeline.setGlobalOption(globalOption);
    var stl = new SimpleTimeline(document.getElementById("timeline-container"), {
        option: {
        },
        items: [
            {
                date: "2022-01-01",
                title: "Item1Title",
                content: "Item1Content"
            }
        ]
    });

    var option = stl.getOption();
    for (const key in SimpleTimeline.defaultOption) {
        console.log(key);
        expect(option[key]).toBe(globalOption[key]);
    }
});

test("オプション反映順", () => {

    const style = window.document.createElement('style');
    window.document.head.appendChild(style);
    document.body.innerHTML = "<div id=\"timeline-container\"></div>";

    const globalOption = {
        debug: true,
        linePosition: "right",
        progress: true,
        progressInverted: true,
        autoProgress: true,
        currentLabel: "testGlobalCurrentLabel",
        header: { label: "testGlobal" },
        footer: { label: "testGlobal" },
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
        itemComparator: SimpleTimeline.itemDateDescComparator,
    };

    SimpleTimeline.setGlobalOption(globalOption);
    var stlEmptyOption = new SimpleTimeline(document.getElementById("timeline-container"), {
        option: {
        },
        items: [
            {
                date: "2022-01-01",
                title: "Item1Title",
                content: "Item1Content"
            }
        ]
    });

    var option = stlEmptyOption.getOption();
    for (const key in SimpleTimeline.defaultOption) {
        console.log(key);
        expect(option[key]).toBe(globalOption[key]);
    }



    var argOption = {
        linePosition: "center",
        progress: true,
        progressInverted: true,
        autoProgress: true,
        currentLabel: "testCurrentLabel",
        header: { label: "test" },
        footer: { label: "test" },
    };

    var stlWithOption = new SimpleTimeline(document.getElementById("timeline-container"), {
        option: argOption,
        items: [
            {
                date: "2022-01-01",
                title: "Item1Title",
                content: "Item1Content"
            }
        ]
    });

    option = stlWithOption.getOption();

    // 引数オプションが優先
    expect(option.linePosition).toBe(argOption.linePosition);
    expect(option.progress).toBe(argOption.progress);
    expect(option.progressInverted).toBe(argOption.progressInverted);
    expect(option.autoProgress).toBe(argOption.autoProgress);
    expect(option.currentLabel).toBe(argOption.currentLabel);
    expect(option.header).toBe(argOption.header);
    expect(option.footer).toBe(argOption.footer);

    // 引数オプションにないものはグローバルオプション
    expect(option.dateFormatter).toBe(globalOption.dateFormatter);
    expect(option.itemStateFactory).toBe(globalOption.itemStateFactory);
});



