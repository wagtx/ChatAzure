import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatWindow from '../ChatWindow.vue'

describe('ChatWindow', () => {
    it('renders properly', () => {
        const wrapper = mount(ChatWindow, {
            props: {
                sessionId: '123'
            }
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('sends message when form is submitted', async () => {
        const wrapper = mount(ChatWindow, {
            props: {
                sessionId: '123'
            }
        })

        const textarea = wrapper.find('textarea')
        await textarea.setValue('Hello, world!')
        await textarea.trigger('keydown.enter')

        // Verify message was sent
        expect(wrapper.emitted('message-sent')).toBeTruthy()
    })

    it('shows typing indicator when other user is typing', async () => {
        const wrapper = mount(ChatWindow, {
            props: {
                sessionId: '123'
            }
        })

        await wrapper.setData({ isTyping: true })
        expect(wrapper.find('.typing-indicator').exists()).toBe(true)
    })
}) 