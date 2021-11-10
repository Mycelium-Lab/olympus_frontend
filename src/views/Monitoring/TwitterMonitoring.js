import React, { useRef, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import '../../styles/monitoring.scss'

import { TextField, Button, Fab } from '@mui/material'
import ClearSharpIcon from '@mui/icons-material/ClearSharp'

import { getTwitList } from '../../dataFetch/twitter/twitter.api'
import { dateFormatter } from '../../util/dataTranformations'
export default function TwitterMonitoring() {
    const ref = useRef()

    const [twitNameValidator, setTwitNameValidator] = React.useState(false)
    const [twitterList, setTwitterList] = React.useState([])

    const [twitName, setTwitName] = React.useState('')
    const handleTwitNameChange = (event) => {
        setTwitName(event.target.value)
        setTwitNameValidator(false)
    }

    const [usernames, setUsernames] = React.useState([
        'OlympusDAO',
        'ohmzeus',
        'OlympusAgora',
    ])

    function twitNameAlreadyAdded(name) {
        return usernames.find((el) => el.toLowerCase() === name.toLowerCase())
    }

    async function addTwitter() {
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
        document.getElementById('tweet').innerHTML = ''
        window.twttr.widgets.createTweet(id, document.getElementById('tweet'), {
            theme: 'light',
        })
    }

    useEffect(async () => {
        if (usernames.length) {
            const primaryTweets = await getTwitList(usernames.join())
            setTwitterList(primaryTweets)
            setTweet(primaryTweets[0].id)
        } else {
            document.getElementById('tweet').innerHTML = ''
        }
    }, [usernames])

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = ref.current.appendChild(script)

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
                {twitterList.length ? (
                    <ul className="twitter-list" style={{ listStyle: 'none' }}>
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
                                                    new Date(twitts.created_at)
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
                    <div className="loader-container">
                        <CircularProgress />
                    </div>
                )}
            </div>
            <div id="tweet" class="twitter-tweet"></div>
        </div>
    )
}
