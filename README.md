<!-- markdownlint-disable no-inline-html first-line-h1 -->

<div align="center">
  <a href="https://app.olympusdao.finance/#/dashboard" target="_blank">
    <img width="150" src="./public/assets/favicons/android-chrome-192x192.png">
  </a>
  <h1>Olympus Monitoring Front End</h1>
</div>

This repository contains the front end part of the monitoring system implemented by Mycelium Lab. Below we go through the structure of the code and explain how to run it.

## Installing Dependencies

```bash
npm ci
```

## Running the Code

```bash
npm start
```

## Building the Source

```bash
npm run build
```

## Folder Structure

A bulk of the codebase is located in <i>src</i> folder. The most essential folders are outlined below.

<ul>
    <li>
        <i>сomponents</a></i> — React components (partials) integrated in major components from <i>views</i> folder;
    </li>
    <li>
        <i>dataFetch</i> — communication with subgraphs and data mapping for further utilization. Topics with sources:
        <ul>
            <li>
                <a target="_blank" href="https://github.com/ilau020203/parser-subgrag-olympus">Treasury</a>
            </li>
            <li>
                <a target="_blank" href="https://github.com/limenal/olympus-query/blob/master/deposits.js">Bonds</a>
            </li>
            <li>
                <a target="_blank" href="https://github.com/limenal/sushi-swap-query/blob/master/pairs.js">DEX</a>
            </li>
            <li>
                <a target="_blank" href="https://github.com/limenal/olympus-query/blob/master/stakes.js">Staking</a>
            </li>
            <li>
                <a target="_blank" href="https://github.com/limenal/olympus-query/blob/master/rebases.js">Rebases</a>
            </li>
        </ul>
    </li>
    <li>
        <i>redux</i> — state management. So far employed only for alerts which are seen throughout the application; 
    </li>
    <li>
        <i>tv-lightweight</i> — a modified version of <a targer="_blank" href="https://github.com/tradingview/lightweight-charts/">Lightweight Charts</a> by TradingView to support parallel crosshair;
    </li>
        <i>util</i> — functions for configuration of charts (please see more below), data transformation, common code and more; 
    </li>
    <li>
        <i>views</i> — all views of the app — each has a designated url.
    </li>
</ul>

## Adding New Parameters and Topics to the General Analytics Legend

1. Add a new topic (.js file) to <i>src/dataFetch</i> or use the existing ones if you just want to create new parameters. The topic must contain a map{TopicName} function to gather all the parameters retrieved from a subgraph and a get{TopicName}InfoFunction to retrieve a "get data" function for the desired timeframe (currently there are 4 of them, but more can be added. Please refer to the mini-guide at the bottom of the page <a target="_blank" href="https://github.com/limenal/olympus-query">here</a>).

2. Add a new item to <i>methodPropsChartConfigs</i> object in <i>src/util/config.js</i>. If you are using an existing topic, please add your new param to the corresponding topic as follows:

```js
staking: [
    // old params
    // ...,
    new MethodPropsChartConfig(
        'New Param',
        (...args) => setBaseHist(...args, 'new_param_name'),
        'Some Calculation Description'
    ),
]
```

If you have added a new topic, please add the topic along with the params in it:

```js
topic_name: [
    // old params
    // ...,
    new MethodPropsChartConfig(
        'New Param',
        (...args) => setBaseHist(...args, 'new_param_name'),
        'Some New Param Calculation Description'
    ),
]
```

3. <b>Only if you have added a new topic (!)</b> Put your new topic inside the switch statement of <i>getMappedScData</i> function in <i>src/util/dataTransformations.js</i> as follows (make sure you have imported all the necessary functions from <i>src/dataFetch/topic_name.js</i> prior to that):

```js
case 'topic_name':
    const getTopicNameInfo = getTopicNameFunction(timeframe)
    data = await getTopicName(startTime, endTime)
    mappedData = mapTopicName(data)
    break
```
