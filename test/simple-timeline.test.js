
import { default as SimpleTimeline } from "../src/simple-timeline"

test("初期化テスト", () => {

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

    
    var itemComponents = document.getElementsByClassName("st-item");
    expect(itemComponents.length).toBe(1);

    var item = itemComponents[0];
    // 時刻
    expect(item.getElementsByClassName("st-datetime").length).toBe(1);
    expect(item.getElementsByClassName("st-datetime")[0].textContent).toBe(new Date("2022-01-01").toLocaleDateString());

    // タイトル
    expect(item.getElementsByClassName("st-title").length).toBe(1);
    expect(item.getElementsByClassName("st-title")[0].textContent).toBe("Item1Title");

    // 内容
    expect(item.getElementsByClassName("st-content").length).toBe(1);
    expect(item.getElementsByClassName("st-content")[0].textContent).toBe("Item1Content");

});



test("日付昇順ソートテスト SimpleTimeline.itemDateAscComparator", () => {

    const items = [
        {
            date: "2022-01-01",
            title: "2022-01-01"
        },
        {
            date: "2022-02-01",
            title: "2022-02-01"
        },
        {
            date: "2022-01-02",
            title: "2022-01-02"
        },
        {
            date: "2022-02-02",
            title: "2022-02-02"
        },
    ];
    items.sort(SimpleTimeline.itemDateAscComparator);

    expect(items[0].date).toBe("2022-01-01");
    expect(items[1].date).toBe("2022-01-02");
    expect(items[2].date).toBe("2022-02-01");
    expect(items[3].date).toBe("2022-02-02");
});

test("日付降順ソートテスト SimpleTimeline.itemDateDescComparator", () => {

    const items = [
        {
            date: "2022-01-01",
            title: "2022-01-01"
        },
        {
            date: "2022-02-01",
            title: "2022-02-01"
        },
        {
            date: "2022-01-02",
            title: "2022-01-02"
        },
        {
            date: "2022-02-02",
            title: "2022-02-02"
        },
    ];
    items.sort(SimpleTimeline.itemDateDescComparator);
    expect(items[0].date).toBe("2022-02-02");
    expect(items[1].date).toBe("2022-02-01");
    expect(items[2].date).toBe("2022-01-02");
    expect(items[3].date).toBe("2022-01-01");
});