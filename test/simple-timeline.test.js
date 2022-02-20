
import { default as SimpleTimeline } from "../src/simple-timeline"

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