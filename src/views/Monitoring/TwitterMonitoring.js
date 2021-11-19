import React, { useRef, useEffect } from 'react'
import Skeleton from '@mui/material/Skeleton'
import '../../styles/monitoring.scss'

import { TextField, Button, Fab } from '@mui/material'
import ClearSharpIcon from '@mui/icons-material/ClearSharp'

import { getTwitList } from '../../dataFetch/twitter/twitter.api'
import { dateFormatter } from '../../util/dataTranformations'
import { setStorageItem, getStorageItem } from '../../util/localStorage'
export default function TwitterMonitoring() {
    const ref = useRef()

    const [twitNameValidator, setTwitNameValidator] = React.useState(false)
    const [tweetLoading, setTweetLoading] = React.useState(true)
    const [tweetId, setTweetId] = React.useState('')

    const [twitterList, setTwitterList] = React.useState([])

    const [twitName, setTwitName] = React.useState('')
    const handleTwitNameChange = (event) => {
        setTwitName(event.target.value)
        setTwitNameValidator(false)
    }

    const [usernames, setUsernames] = React.useState([])

    function twitNameAlreadyAdded(name) {
        return usernames.find((el) => el.toLowerCase() === name.toLowerCase())
    }

    function addTwitter() {
        if (twitName && !twitNameAlreadyAdded(twitName)) {
            setUsernames([...usernames, twitName])
            setTwitName('')
        } else {
            setTwitNameValidator(true)
        }
    }
    function removeTwitter(twit) {
        setUsernames(usernames.filter((el) => el !== twit))
    }

    function setTweet(id) {
        setTweetId(id)
    }

    useEffect(() => {
        if (tweetId) {
            setTweetLoading(true)

            document.getElementById('tweet').innerHTML = ''
            window.twttr.widgets.createTweet(
                tweetId,
                document.getElementById('tweet'),
                {
                    theme: 'light',
                }
            )
            //injected script work with delay, timeout for smoothes
            setTimeout(() => setTweetLoading(false), 600)
        } else if (!tweetId) {
            document.getElementById('tweet').innerHTML = ''
        }
    }, [tweetId])

    useEffect(async () => {
        if (usernames.length) {
            setTwitterList([])
            const primaryTweets = await getTwitList(usernames.join())
            setTwitterList(primaryTweets)
            setTweet(primaryTweets[0].id)
            setStorageItem('twitterUsernames', usernames)
        } else {
            document.getElementById('tweet').innerHTML = ''
            setUsernames(['OlympusDAO', 'ohmzeus', 'OlympusAgora'])
        }
    }, [usernames])

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = ref.current.appendChild(script)
        const lsUsernames = getStorageItem('twitterUsernames')
        if (lsUsernames) {
            setUsernames(lsUsernames)
        } else {
            setUsernames(['OlympusDAO', 'ohmzeus', 'OlympusAgora'])
        }
        return () => {
            ref.current.removeChild(script)
        }
    }, [])

    return (
        <div className="twitter" ref={ref}>
            <div className="twitter-main">
                <div className="twitter-nav">
                    <TextField
                        id="standard-multiline-static"
                        label="Twitter"
                        value={twitName}
                        onChange={handleTwitNameChange}
                        variant="standard"
                        error={twitNameValidator}
                    />
                    <div className="twitter-users">
                        {usernames.map((username, index) => (
                            <Fab
                                key={index}
                                size="small"
                                variant="extended"
                                style={{
                                    cursor: 'default',
                                    marginRight: '8px',
                                    marginBottom: '16px',
                                }}
                            >
                                {username}
                                <ClearSharpIcon
                                    onClick={() => removeTwitter(username)}
                                    style={{
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                    }}
                                />
                            </Fab>
                        ))}
                    </div>
                    <Button onClick={addTwitter} variant="contained">
                        Add twitter
                    </Button>
                </div>
                <div className="twitter-bottom">
                    {twitterList.length ? (
                        <ul
                            className="twitter-list"
                            style={{ listStyle: 'none' }}
                        >
                            {usernames.length ? (
                                twitterList.map((twitts) => (
                                    <li
                                        onClick={() => setTweet(twitts.id)}
                                        className="twitter-list-item"
                                        key={twitts.id}
                                    >
                                        <img
                                            className="twitter-list-icon"
                                            src={twitts.avatar}
                                        />
                                        <div>
                                            <h1 className="twitter-list-title">
                                                <span
                                                    style={{
                                                        color: 'royalblue',
                                                        fontWeight: '700',
                                                    }}
                                                >
                                                    {twitts.name}
                                                </span>

                                                {' ' +
                                                    dateFormatter(
                                                        new Date(
                                                            twitts.created_at
                                                        )
                                                    )}
                                            </h1>
                                            <p className="twitter-list-text">
                                                {twitts.text}
                                            </p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <p
                                        style={{
                                            textAlign: 'center',
                                        }}
                                    >
                                        Nothing found
                                    </p>
                                </li>
                            )}
                        </ul>
                    ) : (
                        Array.apply(null, { length: 4 }).map((e, i) => (
                            <div
                                key={i}
                                className="loader-timeline"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <div className="loader-header">
                                    <Skeleton
                                        variant="circular"
                                        width={50}
                                        height={50}
                                        animation="wave"
                                        className="loader-icon"
                                    />
                                </div>
                                <div className="loader-text">
                                    <Skeleton
                                        variant="text"
                                        animation="wave"
                                        height={30}
                                        className="loader-title"
                                    />
                                    <div className="loader-subtext">
                                        <Skeleton
                                            height={22}
                                            variant="text"
                                            animation="wave"
                                        />
                                        <Skeleton
                                            height={22}
                                            variant="text"
                                            animation="wave"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div className={tweetLoading ? 'none' : ''}>
                        <div id="tweet" class="twitter-tweet "></div>
                    </div>
                    <div className={!tweetLoading ? 'none' : 'loader-wrapper'}>
                        <div className="loader ">
                            <div style={{ display: 'flex' }}>
                                <Skeleton
                                    variant="circular"
                                    width={50}
                                    height={50}
                                    animation="wave"
                                />
                                <div style={{ marginLeft: '12px' }}>
                                    <Skeleton
                                        variant="text"
                                        animation="wave"
                                        height={30}
                                        width={300}
                                    />
                                    <Skeleton
                                        variant="text"
                                        animation="wave"
                                        height={20}
                                        width={150}
                                    />
                                </div>
                            </div>
                            <Skeleton variant="text" animation="wave" />
                            <Skeleton
                                variant="text"
                                animation="wave"
                                width={300}
                            />
                            <Skeleton
                                variant="rectangle"
                                animation="wave"
                                width={390}
                                height={400}
                                style={{
                                    marginTop: '12px',
                                    marginBottom: '12px',
                                    borderRadius: '8px',
                                }}
                            />
                            <Skeleton
                                variant="text"
                                animation="wave"
                                width={150}
                            />
                            <Skeleton
                                variant="rectangle"
                                animation="wave"
                                width={390}
                                height={30}
                                style={{
                                    borderRadius: '32px',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
