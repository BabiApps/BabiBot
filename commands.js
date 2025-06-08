/**
 * @type {Object.<string, Array<{
 * name: string,
 * description: string,
 * usage: string,
 * parameters: ? Array<{
 * name: string,
 * description: string
 *      }>,
 * examples: Array<string>,
 * response: string,
 * notes: ? Array<string>
 * }>>}
 */
const AllCommands = {
    "iw": [
        {
            "name": "!פינג",
            "description": "בדוק אם הבוט עובד ומגיב.",
            "usage": "!פינג",
            "examples": [
                "!פינג"
            ],
            "response": "הבוט ישיב עם הודעת \"פונג\"",
        },
        {
            "name": "!סטיקר",
            "description": "צור סטיקר מתמונה, וידאו קצר, GIF, או טקסט. (שלח '!סטיקר -עזרה' לפרטים נוספים)",
            "usage": "!סטיקר [טקסט] [-פרמטר סוג]",
            "parameters": [
                {
                    "name": "טקסט/ציטוט מדיה",
                    "description": "טקסט שיופיע על הסטיקר, או ציטוט תמונה/וידאו/GIF מהם ייווצר הסטיקר."
                },
                {
                    "name": "-רקע",
                    "description": "שינוי צבע הרקע (לדוגמה: אדום, כחול) או 'שקוף' לסטיקר שקוף. דוגמה: -רקע אדום"
                },
                {
                    "name": "-גופן",
                    "description": "שינוי גופן הטקסט. דוגמה: -גופן אריאל"
                },
                {
                    "name": "-צבע",
                    "description": "שינוי צבע הטקסט. דוגמה: -צבע לבן"
                }
            ],
            "examples": [
                "ציטוט תמונה + !סטיקר",
                "!סטיקר שלום באבי בוט",
                "!סטיקר -צבע אדום אחלה באבי בוט שבעולם"
            ],
            "response": "הבוט ישלח סטיקר שנוצר בהתאם לבקשה.",
            "notes": [
                "תומך בתמונות, GIF וסרטונים עד 10 שניות.",
                "שלח '!סטיקר -עזרה' לקבלת רשימת גופנים וצבעים נתמכים."
            ]
        },
        {
            "name": "!ברקוני",
            "description": "קבל סטיקר רנדומלי של ברקוני",
            "usage": "!ברקוני",
            "examples": [
                "!ברקוני"
            ],
            "response": "הבוט ישיב עם סטיקר רנדומלי של ברקוני.",
            "notes": [
            ]
        },
        {
            "name": "!קופהראשית",
            "description": "קבל סטיקר רנדומלי של קופה ראשית",
            "usage": "!קופהראשית",
            "examples": [
                "!קופהראשית"
            ],
            "response": "הבוט ישיב עם סטיקר רנדומלי של קופה ראשית.",
            "notes": [
            ]
        },
        {
            "name": "!אמלק",
            "description": "קבל סיכום קצרצר של ההודעות האחרונות בשיחה",
            "usage": "!אמלק [פרמטר]",
            "parameters": [
                {
                    "name": "פרמטר",
                    "description": "מספר ההודעות לסיכום"
                }
            ],
            "examples": [
                "!אמלק",
                "!אמלק 100"
            ],
            "response": "הבוט ישיב עם סיכום ההודעות האחרונות בשיחה.",
            "notes": [
                "ניתן לקבל סיכום של עד 1000 הודעות.",
                "ברירת המחדל היא 50 הודעות."
            ]
        },
        {
            "name": "!תמלל",
            "description": "תמלל הודעה קולית",
            "usage": "!תמלל",
            "examples": [
                "!תמלל"
            ],
            "response": "הבוט ישיב עם התמלול של ההודעה הקולית.",
            "notes": [
                "ניתן לשלוח בפרטי הודעה קולית מבלי לציין את הפקודה.",
            ]
        },
        {
            "name": "!השתק",
            "description": "השתק את הקבוצה לפי זמן מסוים",
            "usage": "!השתק [פרמטר]",
            "parameters": [
                {
                    "name": "פרמטר",
                    "description": "מספר הדקות להשתקה"
                }
            ],
            "examples": [
                "!השתק [פרמטר]",
                "!השתק 5"
            ],
            "response": "כאשר מנהל שולח את הפקודה - הקבוצה תושתק מיד, אחרת - תישלח הצבעה שלאחר כמות ההצבעות מסויימת תבוצע ההשתקה",
            "notes": [
                "המספר חייב להיות בין 1 ל60.",
                "ניתן להגדיר את כמות ההצבעות על ידי פקודת \"!הגדר\"."
            ]
        },
        {
            "name": "!בטלהשתקה",
            "description": "בטל השתקה של הקבוצה",
            "usage": "!בטלהשתקה",
            "examples": [
                "!בטלהשתקה"
            ],
            "response": "פתיחת הקבוצה לדיבורים.",
            "notes": [
                "הפקודה זמינה למנהלים בלבד."
            ]
        },
        {
            "name": "!כולם",
            "description": "תייג את כל חברי הקבוצה.",
            "usage": "!כולם",
            "examples": [
                "!כולם"
            ],
            "response": "הבוט יתייג את כל המשתתפים הפעילים בקבוצה.",
            "notes": [
                "פקודה זו זמינה רק למנהלי קבוצה."
            ]
        },
        {
            "name": "!גוגל",
            "description": "חפש מידע בגוגל.",
            "usage": "!גוגל [טקסט]",
            "parameters": [
                {
                    "name": "טקסט",
                    "description": "הטקסט שברצונך לחפש בגוגל. ניתן גם לצטט הודעה קיימת."
                }
            ],
            "examples": [
                "!גוגל מזג אוויר בתל אביב",
                "ציטוט הודעה עם 'מה השעה עכשיו?' ואז שליחת !גוגל"
            ],
            "response": "הבוט ישלח קישור לתוצאות חיפוש בגוגל עבור השאילתא שסופקה.",
            "notes": [
                "אם לא סופקה שאילתא, הבוט יחזיר קישור כללי לגוגל."
            ]
        },
        {
            "name": "!תרגם",
            "description": "תרגם טקסט לשפה אחרת.",
            "usage": "!תרגם [שפה] [טקסט] או ציטוט הודעה עם !תרגם [שפה]",
            "parameters": [
                {
                    "name": "שפה",
                    "description": "השפה אליה תרצה לתרגם, ניתן לכתוב את שם השפה או את קוד השפה (לדוגמה: en, he, es)."
                },
                {
                    "name": "טקסט",
                    "description": "הטקסט לתרגום. אם מצטטים הודעה, הטקסט יילקח ממנה."
                }
            ],
            "examples": [
                "!תרגם לאנגלית שלום עולם",
                "!תרגם לעברית Hello world",
                "!תרגם he Hello world",
                "ציטוט הודעה עם טקסט + !תרגם fr"
            ],
            "response": "הבוט יתרגם את הטקסט לשפה המבוקשת וישלח את התרגום.",
            "notes": [
                "אם לא מציינים שפת יעד, הבוט יתרגם לאנגלית כברירת מחדל."
            ]
        },
        {
            "name": "!אודות",
            "description": "קבל מידע על הבוט.",
            "usage": "!אודות",
            "examples": [
                "!אודות"
            ],
            "response": "הבוט ישלח הודעה עם מידע על עצמו.",
        },
        {
            "name": "!תרומה",
            "description": "קבל מידע על דרכים לתמוך ולתרום לבוט.",
            "usage": "!תרומה",
            "examples": [
                "!תרומה"
            ],
            "response": "הבוט ישלח הודעה המפרטת דרכים לתמוך בפיתוח הבוט, כגון קישורי תרומה.",
        },
        {
            "name": "jct",
            "description": "פקודות ספציפיות לסטודנטים במכון לב (JCT).",
            "usage": "מייל של [שם מרצה]",
            "parameters": [
                {
                    "name": "שם מרצה",
                    "description": "שם המרצה שאת המייל שלו תרצה לקבל."
                }
            ],
            "examples": [
                "מייל של מזתל",
                "אפשר בבקשה את המספר של המזכירות?",
                "איזה קורס חוסם את מבנה נתונים א?",
                "איזה קורס חסום על ידי אינפי?"
            ],
            "response": "הבוט יספק מידע רלוונטי או יבצע פעולה בהתאם לבקשה (לדוגמה: מספר טלפון של מרצה, רשימת קורסים).",
            "notes": [

            ]
        },
        {
            "name": "!שמור",
            "description": "שמור פתק. (השב להודעה או כתוב טקסט)",
            "usage": "!שמור [שם_פתק] [תוכן_פתק] או השב להודעה עם !שמור [שם_פתק]",
            "parameters": [
                {
                    "name": "שם_פתק",
                    "description": "השם שיוקצה לפתק."
                },
                {
                    "name": "תוכן_פתק",
                    "description": "הטקסט שיישמר בפתק. אם משיבים להודעה, תוכן ההודעה ישמש כתוכן הפתק."
                }
            ],
            "examples": [
                "!שמור ברוך ברוך הבא לבוט",
                "השב להודעה + !שמור תזכורת"
            ],
            "response": "הפתק נשמר בהצלחה.",
            "notes": [
                "הפתקים נשמרים לפי הצאט בו הם נשמרו.",
                "שם ההערה הוא עד הרווח הראשון, אם יש רווחים נוספים הם ייחשבו כחלק מהתוכן.",
            ]
        },
        {
            "name": "!מחק",
            "description": "מחק פתק קיים.",
            "usage": "!מחק [שם_פתק]",
            "parameters": [
                {
                    "name": "שם_פתק",
                    "description": "השם של הפתק למחיקה."
                }
            ],
            "examples": [
                "!מחק ברוך",
                "!מחק הודעהחשובה"
            ],
            "response": "הפתק נמחק בהצלחה.",
            "notes": [
                "פתקים גלובליים יכולים להימחק על ידי משתמשי על בלבד."
            ]
        },
        {
            "name": "#הערה",
            "description": "קבל פתק שמור.",
            "usage": "#[שם_פתק]",
            "parameters": [
                {
                    "name": "שם_פתק",
                    "description": "השם של הפתק שברצונך לקבל."
                }
            ],
            "examples": [
                "#תזכורת"
            ],
            "response": "תוכן הפתק המבוקש יישלח.",
            "notes": [
            ]
        },
        {
            "name": "!הערות",
            "description": "קבל רשימה של כל ההערות השמורות שזמינות בצאט.",
            "usage": "!הערות",
            "examples": [
                "!הערות"
            ],
            "response": "רשימה של כל הפתקים השמורים תישלח.",
            "notes": [

            ]
        },
        {
            "name": "!חסוםקישורים",
            "description": "חסום קישורים בקבוצה",
            "usage": "!חסוםקישורים",
            "examples": [
                "!חסוםקישורים"
            ],
            "response": "הבוט יחסום קישורים בקבוצה.",
            "notes": [
                "הפקודה זמינה למנהלים בלבד.",
                "האיסור לא יחול על מנהלים.",
            ]
        },
        {
            "name": "!בטלחסימתקישורים",
            "description": "בטל חסימת קישורים בקבוצה",
            "usage": "!בטלחסימתקישורים",
            "examples": [
                "!בטלחסימתקישורים"
            ],
            "response": "הבוט יבטל את חסימת קישורים בקבוצה.",
            "notes": [
                "הפקודה זמינה למנהלים בלבד."
            ]
        }
    ],
    "en": [
        {
            "name": "!ping",
            "description": "Check if the bot is working and responsive.",
            "usage": "!ping",
            "examples": [
                "!ping"
            ],
            "response": "The bot will reply with a \"pong\" message, indicating its response time.",
        },
        {
            "name": "!sticker",
            "description": "Create a sticker from an image, short video, GIF, or text. (Send '!sticker -help' for more details)",
            "usage": "!sticker [text/media_quote] [-parameter type]",
            "parameters": [
                {
                    "name": "text/media_quote",
                    "description": "Text to appear on the sticker, or quote an image/video/GIF to create a sticker from."
                },
                {
                    "name": "-background",
                    "description": "Change the background color (e.g., red, blue) or 'transparent' for a transparent sticker. Example: -background red"
                },
                {
                    "name": "-font",
                    "description": "Change the text font. Example: -font Arial"
                },
                {
                    "name": "-color",
                    "description": "Change the text color. Example: -color white"
                }
            ],
            "examples": [
                "Quote image + !sticker",
                "!sticker Hello Babi Bot",
                "!sticker -color red Best Babi Bot ever"
            ],
            "response": "The bot will send a sticker created according to the request.",
            "notes": [
                "Supports images, GIFs, and videos up to 10 seconds.",
                "Send '!sticker -help' for a list of supported fonts and colors."
            ]
        },
        {
            "name": "!barkuni",
            "description": "Get a random Barkuni sticker.",
            "usage": "!barkuni",
            "examples": [
                "!barkuni"
            ],
            "response": "The bot will reply with a random Barkuni sticker.",
            "notes": [
            ]
        },
        {
            "name": "!kuparashit",
            "description": "Get a random Kupa Rashit sticker.",
            "usage": "!kuparashit",
            "examples": [
                "!kuparashit"
            ],
            "response": "The bot will reply with a random Kupa Rashit sticker.",
            "notes": [
            ]
        },
        {
            "name": "!tldr",
            "description": "Get a brief summary of the last messages in the chat.",
            "usage": "!tldr [parameter]",
            "parameters": [
                {
                    "name": "parameter",
                    "description": "Number of messages to summarize"
                }
            ],
            "examples": [
                "!tldr",
                "!tldr 100"
            ],
            "response": "The bot will reply with a summary of the last messages in the chat.",
            "notes": [
                "You can get a summary of up to 1000 messages.",
                "The default is 50 messages."
            ]
        },
        {
            "name": "!transcribe",
            "description": "Transcribe a voice message.",
            "usage": "!transcribe",
            "examples": [
                "!transcribe"
            ],
            "response": "The bot will reply with the transcription of the voice message.",
            "notes": [
                "You can send a voice message privately without specifying the command."
            ]
        },
        {
            "name": "!mute",
            "description": "Mute the group for a specific time.",
            "usage": "!mute [parameter]",
            "parameters": [
                {
                    "name": "parameter",
                    "description": "Number of minutes to mute"
                }
            ],
            "examples": [
                "!mute [parameter]",
                "!mute 5"
            ],
            "response": "When an admin sends the command - the group will be muted immediately, otherwise - a poll will be sent, and after a certain number of votes, the mute will be executed.",
            "notes": [
                "The number must be between 1 and 60.",
                "The number of votes can be set by the \"!set\" command."
            ]
        },
        {
            "name": "!unmute",
            "description": "Unmute the group.",
            "usage": "!unmute",
            "examples": [
                "!unmute"
            ],
            "response": "The group will be opened for speaking.",
            "notes": [
                "This command is available to administrators only."
            ]
        },
        {
            "name": "!everyone",
            "description": "Tag all group participants.",
            "usage": "!everyone",
            "examples": [
                "!everyone"
            ],
            "response": "The bot will tag all active participants in the group.",
            "notes": [
                "This command is only available to group administrators."
            ]
        },
        {
            "name": "!google",
            "description": "Search for information on Google.",
            "usage": "!google [text]",
            "parameters": [
                {
                    "name": "text",
                    "description": "The text you want to search for on Google. You can also quote an existing message."
                }
            ],
            "examples": [
                "!google weather in Tel Aviv",
                "Quote message with 'What time is it now?' then send !google"
            ],
            "response": "The bot will send a link to Google search results for the provided query.",
            "notes": [
                "If no query is provided, the bot will return a general Google link."
            ]
        },
        {
            "name": "!translate",
            "description": "Translate text to another language.",
            "usage": "!translate [language] [text] or quote a message with !translate [language]",
            "parameters": [
                {
                    "name": "language",
                    "description": "The language you want to translate to. You can write the language name or its code (e.g., en, he, es)."
                },
                {
                    "name": "text",
                    "description": "The text to translate. If quoting a message, the text will be taken from it."
                }
            ],
            "examples": [
                "!translate to English Hello world",
                "!translate to Hebrew שלום עולם",
                "!translate he Hello world",
                "Quote message with text + !translate fr"
            ],
            "response": "The bot will translate the text to the requested language and send the translation.",
            "notes": [
                "If no target language is specified, the bot will translate to English by default."
            ]
        },
        {
            "name": "!about",
            "description": "Get information about the bot.",
            "usage": "!about",
            "examples": [
                "!about"
            ],
            "response": "The bot will send a message with information about itself.",
        },
        {
            "name": "!donate",
            "description": "Get information on ways to support and donate to the bot.",
            "usage": "!donate",
            "examples": [
                "!donate"
            ],
            "response": "The bot will send a message detailing ways to support the bot's development, such as donation links.",
        },
        {
            "name": "!save",
            "description": "Save a note. (Reply to a message or type text)",
            "usage": "!save [note_name] [note_content] or reply to a message with !save [note_name]",
            "parameters": [
                {
                    "name": "note_name",
                    "description": "The name to assign to the note."
                },
                {
                    "name": "note_content",
                    "description": "The text to be saved in the note. If replying to a message, the message content will be used as the note content."
                }
            ],
            "examples": [
                "!save welcome Welcome to the bot",
                "Reply to a message + !save reminder"
            ],
            "response": "The note has been successfully saved.",
            "notes": [
                "Notes are saved per chat.",
                "The note name is up to the first space; if there are additional spaces, they will be considered part of the content."
            ]
        },
        {
            "name": "!delete",
            "description": "Delete an existing note.",
            "usage": "!delete [note_name]",
            "parameters": [
                {
                    "name": "note_name",
                    "description": "The name of the note to delete."
                }
            ],
            "examples": [
                "!delete welcome",
                "!delete important_message"
            ],
            "response": "The note has been successfully deleted.",
            "notes": [
                "Global notes can only be deleted by superusers."
            ]
        },
        {
            "name": "#note",
            "description": "Get a saved note.",
            "usage": "#[note_name]",
            "parameters": [
                {
                    "name": "note_name",
                    "description": "The name of the note you want to retrieve."
                }
            ],
            "examples": [
                "#reminder"
            ],
            "response": "The content of the requested note will be sent.",
            "notes": []
        },
        {
            "name": "!notes",
            "description": "Get a list of all saved notes available in the chat.",
            "usage": "!notes",
            "examples": [
                "!notes"
            ],
            "response": "A list of all saved notes will be sent.",
            "notes": []
        },
        {
            "name": "!blocklinks",
            "description": "Block links in the group.",
            "usage": "!blocklinks",
            "examples": [
                "!blocklinks"
            ],
            "response": "The bot will block links in the group.",
            "notes": [
                "This command is available to administrators only.",
                "The prohibition will not apply to administrators."
            ]
        },
        {
            "name": "!unblocklinks",
            "description": "Unblock links in the group.",
            "usage": "!unblocklinks",
            "examples": [
                "!unblocklinks"
            ],
            "response": "The bot will unblock links in the group.",
            "notes": [
                "This command is available to administrators only."
            ]
        }
    ]
}

// Used in HTML page
const keyNotes = {
    "iw": {
        "description": "תיאור",
        "usage": "שימוש",
        "parameters": "פרמטרים",
        "examples": "דוגמאות",
        "response": "תגובה",
        "notes": "הערות"
    },
    "en": {
        "description": "Description",
        "usage": "Usage",
        "parameters": "Parameters",
        "examples": "Examples",
        "response": "Response",
        "notes": "Notes"
    }
}

export { AllCommands, keyNotes };