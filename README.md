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
    <li>
        <i>util</i> — functions for configuration of charts (please see more below), data transformation, common code and more; 
    </li>
    <li>
        <i>views</i> — all views of the app — each has a designated url.
    </li>
</ul>

## Adding New Parameters and Topics to the General Analytics Legend

1. Add a new topic (.js file) to <i>src/dataFetch</i> or use the existing ones if you just want to create new parameters. The topic must contain a `map{TopicName}` function to gather all the parameters retrieved from a subgraph and a `get{TopicName}InfoFunction` to retrieve a "get data" function for the desired timeframe (currently there are 4 of them, but more can be added. Please refer to the mini-guide at the bottom of the page <a target="_blank" href="https://github.com/limenal/olympus-query">here</a>).

2. Add a new item to `methodPropsChartConfigs` object in <i>src/util/config.js</i>. If you are using an existing topic, please add your new param to the corresponding topic as follows:

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

3. <b>Only if you have added a new topic (!)</b> Put your new topic inside the switch statement of `getMappedScData` function in <i>src/util/dataTransformations.js</i> as follows (make sure you have imported all the necessary functions from <i>src/dataFetch/topic_name.js</i> prior to that):

```js
case 'topic_name':
    const getTopicNameInfo = getTopicNameFunction(timeframe)
    data = await getTopicName(startTime, endTime)
    mappedData = mapTopicName(data)
    break
```

## Adding a New Timeframe to the General Analytics Charts

So far the application has 8 timeframes to view your charts on. However, functions managing timeframes can be customized further to create new intervals of a desired length. Two steps need to be taken to achieve this:

1. Let's say that we would like to add a 2H interval. In <i>src/util/config.js</i> find the `timeframesConfig` function and add the following contents (the code below can be easily refactored to be more concise and enable automation, but so far is left as-is to increase flexibility):

```js
// select how much data (in days) will be fetched on first load.
// we might want to make it proportional to the rest of the intervals.
const fourHourlyFetchBackDelta = 25
const twoHourlyFetchBackDelta = 16 // new timeframe
const hourlyFetchBackDelta = 10
```

```js
// get start timestamp for the initial fetch
const initialFourHourlyTimestamp = nextDayMidnight
    .clone()
    .subtract(fourHourlyFetchBackDelta, 'days')
    .unix()

const initialTwoHourlyTimestamp = nextDayMidnight // new timeframe
    .clone()
    .subtract(twoHourlyFetchBackDelta, 'days')
    .unix()

const initialHourlyTimestamp = nextDayMidnight
    .clone()
    .subtract(hourlyFetchBackDelta, 'days')
    .unix()
```

```js
// in the return statement
return [
    // rest
    {
        name: '4H',
        initialTimestamp: initialFourHourlyTimestamp,
        endTimestamp,
        fetchBackDelta: fourHourlyFetchBackDelta,
        intervalDiff: 86400 / 6,
    },
    {
        // new timeframe
        name: '2H',
        initialTimestamp: initialTwoHourlyTimestamp,
        endTimestamp,
        fetchBackDelta: twoHourlyFetchBackDelta,
        intervalDiff: 86400 / 12, // what is two hours relative to a unix day
    },
    {
        name: '1H',
        initialTimestamp: initialHourlyTimestamp,
        endTimestamp,
        fetchBackDelta: hourlyFetchBackDelta,
        intervalDiff: 86400 / 24,
    },
]
```

2. Go to <i>src/dataFetch/topic_name.js</i>. The following must be done for all of the topics we have to enable the new timeframe, but let's take <i>src/dataFetch/stakes.js</i> as an example. Go to `getStakesInfoFunction` below and change some of its contents to:

```js
case 3:
    return (...rest) => getStakesInfoNHours(...rest, 4)
case 4: // new timeframe
    return (...rest) => getStakesInfoNHours(...rest, 2)
case 5:
    return (...rest) => getStakesInfoNHours(...rest, 1)
```

The number in "case" corresponds to the index of the new timeframe in the return array from the section above. This is done as such to enable a possible reformation to strings (e.g., '2H', '4H') instead of numbers in the switch-case statement. As it can be seen, we have created our timeframe from a corresponding "NHours" function, passing "2" as our N. However, it can be applied to days and minutes as well, following the very same approach.

## Integrating Charts

To integrate charts with OlympusDAO stats as done in 'General Analytics' or 'Dashboard', one can employ the `useCharts` hook from <i>src/hooks/useCharts.js</i>. `useCharts` requires a `store` parameter which is the name of a Redux reducer consumed by a particular instance of `useCharts`. Some examples of stores (and actions) can be seen in <i>src/redux/reducers</i> and <i>src/redux/actions</i> correspondingly.

The `useCharts` hook returns a plain js object containing some of the parameters required for consuming the charts in React components. These are `refs`, `key`, `ohlcs` and `methods`. The latter two stand for "open/high/close/low" and "types of data available for display" correspondingly and are left in the hook (instead of being placed in the Redux store) for performance reasons. The former two, however, are of much higher importance. `refs` are essentially the charts themselves and can be embedded into any DOM element as done in <i>src/views/Dashboard.js</i>, for instance, with the following bit of code:

```jsx
<Chart
    key={idx}
    chartRef={refs[idx]}
    index={idx}
    ohlc={ohlcs[idx]}
    method={methods[idx]}
    {...{
        store,
    }}
/>
```

where `Chart` returns a plain div:

```jsx
<div
    style={isGlobalLoading ? { zIndex: -1 } : {}}
    className="chart-inner"
    ref={chartRef}
></div>
```

The `key` prop, in its turn, will help rerender the parent component which wraps the charts when `refs` change, so is essential for inclusion as follows:

```jsx
<div key={key} className="main-content dashboard-view">
    ...your charts
</div>
```
