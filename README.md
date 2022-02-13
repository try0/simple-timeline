# simple-timeline


[Example](https://try0.github.io/simple-timeline/example/index.html)

![simple-timeline](https://user-images.githubusercontent.com/17096601/153722631-52e8e604-ab30-4383-a99f-073020a0a4cb.gif)





```js
const stl = new SimpleTimeline(document.getElementById("timeline-container"), {
    option: {
        progress: true,
        currentLabel: "Current"
    },
    items: [
        {
            state: "passed",
            date: "2022-01-01",
            title: "Passed item",
            content: "Passed item",
        },
        {
            state: "current",
            date: "2022-01-02",
            title: "Current item",
            content: "Current item",
        },
        {
            state: "schedule",
            date: "2022-01-03",
            title: "Schedule item",
            content: "Schedule item",
        },
    ]
});
```



```js
SimpleTimeline.setGlobalOption({
// your global options
});
```

|  Option  |    |
| ---- | ---- |
|  progress  |  ステータスを考慮して、ラインを描画する  |
|  progressInverted  |  ラインの進行状況を逆にする  |
|  autoProgress  |  現在日時と比較してラインを描画する  |
|  dateFormatter  |  日付フォーマッター  |
|  currentLabel  |  現在のアイテムを強調するラベル文字列  |
|  header  |  ヘッダー<br>{ label: "Header" } |
|  footer  |  フッター<br>{ label: "Footer" } |

[Example](https://github.com/try0/simple-timeline/blob/main/example/index.html)


