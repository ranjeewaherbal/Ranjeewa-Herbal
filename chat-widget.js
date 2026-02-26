(function() {
    // Inject Styles
    const widgetStyles = `
        #ai-chat-widget-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
        }
        #ai-chat-widget-container * {
            box-sizing: border-box;
        }
        #ai-chat-bubble {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            background: linear-gradient(135deg, #047857, #065f46);
            box-shadow: 0 4px 15px rgba(4, 120, 87, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            margin-left: auto;
        }
        #ai-chat-bubble:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(4, 120, 87, 0.6);
        }
        #ai-chat-window {
            display: none;
            width: 350px;
            height: 500px;
            max-height: 80vh;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            flex-direction: column;
            overflow: hidden;
            position: absolute;
            bottom: 80px;
            right: 0;
            border: 1px solid #e5e7eb;
            transition: all 0.3s ease;
            transform-origin: bottom right;
        }
        #ai-chat-window.open {
            display: flex;
            animation: chatAppear 0.3s forwards;
        }
        @keyframes chatAppear {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        #ai-chat-header {
            background: linear-gradient(135deg, #047857, #065f46);
            color: white;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        #ai-chat-header-title {
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #ai-chat-header-close {
            cursor: pointer;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.2s;
        }
        #ai-chat-header-close:hover {
            background: rgba(255,255,255,0.4);
        }
        #ai-chat-messages {
            flex-grow: 1;
            padding: 16px;
            overflow-y: auto;
            background-color: #f9fafb;
            display: flex;
            flex-direction: column;
            gap: 12px;
            scroll-behavior: smooth;
        }
        .ai-message {
            background-color: #e5e7eb;
            color: #1f2937;
            padding: 12px 16px;
            border-radius: 16px 16px 16px 4px;
            max-width: 85%;
            align-self: flex-start;
            font-size: 14px;
            line-height: 1.5;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .user-message {
            background-color: #047857;
            color: white;
            padding: 12px 16px;
            border-radius: 16px 16px 4px 16px;
            max-width: 85%;
            align-self: flex-end;
            font-size: 14px;
            line-height: 1.5;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        #ai-chat-input-area {
            display: flex;
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            background: white;
            align-items: center;
            gap: 8px;
        }
        #ai-chat-input {
            flex-grow: 1;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            padding: 10px 16px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.2s;
            width: 100%;
        }
        #ai-chat-input:focus {
            border-color: #047857;
        }
        .ai-btn {
            background: #047857;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: 0.2s;
            flex-shrink: 0;
            padding: 0;
        }
        .ai-btn:hover {
            background: #065f46;
        }
        .ai-btn-voice {
            background: #f3f4f6;
            color: #ef4444;
            border: 1px solid #e5e7eb;
        }
        .ai-btn-voice:hover {
            background: #fee2e2;
        }
        .ai-btn-voice.recording {
            background: #ef4444;
            color: white;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            background-color: #e5e7eb;
            border-radius: 16px 16px 16px 4px;
            align-self: flex-start;
            width: fit-content;
            margin-bottom: 12px;
        }
        .typing-dot {
            width: 6px;
            height: 6px;
            background-color: #6b7280;
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = widgetStyles;
    document.head.appendChild(styleSheet);

    // AI Knowledge Base
    const kb = [
        {
            keywords: ["product", "oil", "buy", "price", "cost", "how much", "what do you sell"],
            text: "We offer premium herbal oils: Varicose Relief Oil (LKR 1,500), Herbal Hair Oil (LKR 1,200), and Migraine Relief Oil (LKR 950). Would you like to know more about a specific one?",
            speech: "අපි ළඟ වරිකෝස්, හිසකෙස්, සහ මයිග්‍රේන් සඳහා විශේෂ ආයුර්වේද තෙල් වර්ග තිබෙනවා. මිල ගණන් රුපියල් දහසයි පන්සියයේ සිට ආරම්භ වෙනවා."
        },
        {
            keywords: ["varicose", "vein", "spider"],
            text: "Our Varicose Relief Oil is a special formula for vein health. It costs LKR 1,500. You can explore it on our Products page!",
            speech: "අපගේ වරිකෝස් තෙල්, නහර රැකගැනීමට විශේෂිත නිපැයුමක්. එහි මිල රුපියල් දහසයි පන්සියයයි."
        },
        {
            keywords: ["hair", "fall", "growth", "bald", "shampoo"],
            text: "Our Herbal Hair Oil promotes hair growth and prevents hair fall effectively. It is priced at LKR 1,200.",
            speech: "අපගේ හිසකෙස් තෙල්, හිසකෙස් වර්ධනයට මෙන්ම හිසකෙස් ගැලවී යාම වැළැක්වීමට කදිම විසඳුමක්. මිල රුපියල් දහසයි දෙසියයයි."
        },
        {
            keywords: ["migraine", "headache", "head", "pain"],
            text: "Our Migraine Relief Oil provides instant relief for severe headaches and migraines. It costs LKR 950.",
            speech: "මයිග්‍රේන් තෙල් හරහා ඔබට හිසරුදාවට ක්ෂණික සහනයක් ලබා ගත හැක. එහි මිල රුපියල් නමසිය පනහයි."
        },
        {
            keywords: ["treatment", "service", "book", "massage", "shirodhara", "steam", "sarwanga", "therapy", "clinic"],
            text: "We offer authentic Sarwanga Ayurveda treatments including Shirodhara, Steam baths, and Varicose treatments at our center. Please visit our Treatments page to book.",
            speech: "අපගේ ආයුර්වේද මධ්‍යස්ථානයේදී ශිරෝධාරා, වාෂ්ප ස්නානය සහ සර්වාංග ප්‍රතිකාර ලබා ගත හැක."
        },
        {
            keywords: ["doctor", "indrani", "kariyawasam", "physician", "who", "consult", "medical"],
            text: "Dr. Indrani Kariyawasam provides consultations. She has 30 years of experience in Sri Lankan traditional Ayurveda, specializing in Sarwanga and eye treatments.",
            speech: "අපගේ ප්‍රධාන වෛද්‍යවරිය ඉන්ද්‍රානි කාරියවසම් මහත්මියයි. ඇයට ආයුර්වේද වෛද්‍ය ක්ෂේත්‍රයේ වසර තිහක විශිෂ්ට පළපුරුද්දක් තිබෙනවා."
        },
        {
            keywords: ["hi", "hello", "hey", "ayubowan", "good morning", "good evening"],
            text: "Ayubowan! Welcome to Ranjeewa Herbal. I am your AI assistant. Ask me anything about our treatments or products!",
            speech: "ආයුබෝවන්! රන්ජීව හර්බල් වෙත ඔබව සාදරයෙන් පිළිගනිමු. මම ඔබේ කෘතිම බුද්ධි සහායිකාව. අපගේ නිෂ්පාදන සහ ප්‍රතිකාර ගැන ඕනෑම දෙයක් අසන්න."
        },
        {
            keywords: ["contact", "location", "address", "phone", "where", "call", "appointment", "email"],
            text: "We are located at 123 Ayurveda Lane, Colombo, Sri Lanka. You can call us at +94 11 234 5678 to book an appointment.",
            speech: "අපගේ ලිපිනය එකසිය විසි තුන, ආයුර්වේද මාවත, කොළඹ. දුරකථන අංකය බිංදුවයි එකයි එකයි, දෙකයි තුනයි හතරයි, පහයි හයයි හතයි අට."
        },
        {
            keywords: ["default"],
            text: "I'm still learning! Could you please ask me about our herbal products, specific oils, our treatments, or our doctor?",
            speech: "මට ඔබව හරියටම තේරුණේ නැහැ. කරුණාකර අපගේ නිෂ්පාදන, තෙල් වර්ග හෝ ප්‍රතිකාර ගැන අසන්න."
        }
    ];

    // Helper to find response based on keyword matching
    function getResponse(query) {
        query = query.toLowerCase();
        for (let i = 0; i < kb.length - 1; i++) {
            if (kb[i].keywords.some(kw => query.includes(kw))) {
                return kb[i];
            }
        }
        return kb[kb.length - 1]; // return default
    }

    // Creating HTML Structure
    const widgetContainer = document.createElement("div");
    widgetContainer.id = "ai-chat-widget-container";
    widgetContainer.innerHTML = `
        <div id="ai-chat-window">
            <div id="ai-chat-header">
                <div id="ai-chat-header-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10A10 10 0 0 0 12 2Z"></path><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                    AI Assistant
                </div>
                <div id="ai-chat-header-close" title="Close chat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </div>
            </div>
            <div id="ai-chat-messages">
                <div class="ai-message">Ayubowan! I am the Ranjeewa Herbal AI Assistant. Type or speak your questions about our Ayurvedic products and treatments.</div>
            </div>
            <div id="ai-chat-input-area">
                <button id="ai-chat-voice-btn" class="ai-btn ai-btn-voice" title="Speak to me (Mic)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                </button>
                <input type="text" id="ai-chat-input" placeholder="Type a message..." autocomplete="off"/>
                <button id="ai-chat-send-btn" class="ai-btn" title="Send message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
        <div id="ai-chat-bubble" title="Chat with our AI">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
    `;
    
    // Inject safely when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(widgetContainer);
            initChat();
        });
    } else {
        document.body.appendChild(widgetContainer);
        initChat();
    }

    function initChat() {
        const chatBubble = document.getElementById("ai-chat-bubble");
        const chatWindow = document.getElementById("ai-chat-window");
        const chatClose = document.getElementById("ai-chat-header-close");
        const messagesArea = document.getElementById("ai-chat-messages");
        const inputField = document.getElementById("ai-chat-input");
        const sendBtn = document.getElementById("ai-chat-send-btn");
        const voiceBtn = document.getElementById("ai-chat-voice-btn");

        // Toggle window
        chatBubble.addEventListener("click", () => {
            chatWindow.classList.toggle("open");
            if(chatWindow.classList.contains("open")) {
                inputField.focus();
                // Play a subtle welcome sound or just welcome text
            }
        });
        
        chatClose.addEventListener("click", () => {
            chatWindow.classList.remove("open");
        });

        function addMessage(text, sender) {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();

            const msgDiv = document.createElement("div");
            msgDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
            msgDiv.textContent = text;
            messagesArea.appendChild(msgDiv);
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }

        function showTyping() {
            const typingDiv = document.createElement("div");
            typingDiv.className = "typing-indicator";
            typingDiv.id = "typing-indicator";
            typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            messagesArea.appendChild(typingDiv);
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }

        function handleSend() {
            const text = inputField.value.trim();
            if(!text) return;
            
            inputField.value = '';
            addMessage(text, 'user');
            
            processQuery(text, false);
        }

        function processQuery(query, speakLoud) {
            showTyping();
            
            setTimeout(() => {
                const reply = getResponse(query);
                addMessage(reply.text, 'ai');
                
                if (speakLoud || isVoiceModeActive) {
                    speakSinhala(reply.speech);
                }
            }, 800 + Math.random() * 500);
        }

        sendBtn.addEventListener("click", handleSend);
        inputField.addEventListener("keypress", (e) => {
            if(e.key === 'Enter') handleSend();
        });

        // Speech Recognition Setup
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition;
        let isVoiceModeActive = false;
        
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            // Using English tracking as user types English queries normally, but allows them to speak
            recognition.lang = 'en-US'; 
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = function() {
                voiceBtn.classList.add('recording');
                inputField.placeholder = "Listening...";
                isVoiceModeActive = true;
            };

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                addMessage(transcript, 'user');
                processQuery(transcript, true); 
            };

            recognition.onspeechend = function() {
                recognition.stop();
                voiceBtn.classList.remove('recording');
                inputField.placeholder = "Type a message...";
            };

            recognition.onerror = function(event) {
                console.error('Speech Recognition Error: ', event.error);
                voiceBtn.classList.remove('recording');
                inputField.placeholder = "Type a message...";
            };

            voiceBtn.addEventListener('click', () => {
                chatWindow.classList.add("open");
                if (voiceBtn.classList.contains("recording")) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            });
        } else {
            voiceBtn.style.display = 'none';
        }

        // Web Speech API - Text to Speech
        function speakSinhala(text) {
            if (!('speechSynthesis' in window)) return;
            
            window.speechSynthesis.cancel(); 
            
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            
            let selectedVoice = null;
            
            // Priority 1: Sinhala Female Voice
            selectedVoice = voices.find(v => v.lang.includes('si') && v.name.includes('Female'));
            
            // Priority 2: Any Sinhala Voice
            if (!selectedVoice) {
                selectedVoice = voices.find(v => v.lang.includes('si'));
            }
            
            // Priority 3: Fallback Female Voice (To sound somewhat natural with general fallback text if browser forces English)
            if (!selectedVoice) {
                selectedVoice = voices.find(v => v.name.includes('Female') && (v.lang.includes('en') || v.lang.includes('hi')));
            }
            // Priority 4: Browser default
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            
            utterance.rate = 0.95;
            utterance.pitch = 1.2; // Increase pitch to sound more feminine if the default OS has only one voice
            
            window.speechSynthesis.speak(utterance);
        }
        
        // Ensure browser loads voices early
        if ('speechSynthesis' in window && speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
        }
    }

})();
