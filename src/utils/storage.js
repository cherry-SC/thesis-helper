export const STORAGE_KEYS = {
  CURRENT_USER: 'thesis_helper_user',
  USERS: 'thesis_helper_users',
  REFERENCES: 'thesis_helper_references',
  FORMAT_CONFIG: 'thesis_helper_format',
  PROGRESS: 'thesis_helper_progress',
  PAPERS: 'thesis_helper_papers'
}

export const storage = {
  get(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  remove(key) {
    localStorage.removeItem(key)
  },

  clear() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  }
}

export const auth = {
  getCurrentUser() {
    return storage.get(STORAGE_KEYS.CURRENT_USER)
  },

  login(email, password) {
    const users = storage.get(STORAGE_KEYS.USERS) || []
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      const { password: _, ...safeUser } = user
      storage.set(STORAGE_KEYS.CURRENT_USER, safeUser)
      return safeUser
    }
    return null
  },

  register(name, email, password) {
    const users = storage.get(STORAGE_KEYS.USERS) || []
    if (users.find(u => u.email === email)) {
      return { error: '邮箱已被注册' }
    }
    const newUser = { 
      id: Date.now(), 
      name, 
      email, 
      password,
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    storage.set(STORAGE_KEYS.USERS, users)
    const { password: _, ...safeUser } = newUser
    storage.set(STORAGE_KEYS.CURRENT_USER, safeUser)
    return safeUser
  },

  logout() {
    storage.remove(STORAGE_KEYS.CURRENT_USER)
  },

  isLoggedIn() {
    return !!this.getCurrentUser()
  }
}

export const referenceStore = {
  getAll() {
    const user = auth.getCurrentUser()
    if (!user) return []
    const all = storage.get(STORAGE_KEYS.REFERENCES) || {}
    return all[user.id] || []
  },

  save(references) {
    const user = auth.getCurrentUser()
    if (!user) return false
    const all = storage.get(STORAGE_KEYS.REFERENCES) || {}
    all[user.id] = references
    return storage.set(STORAGE_KEYS.REFERENCES, all)
  },

  add(ref) {
    const refs = this.getAll()
    refs.push({ ...ref, id: Date.now(), createdAt: new Date().toISOString() })
    return this.save(refs)
  },

  delete(id) {
    const refs = this.getAll().filter(r => r.id !== id)
    return this.save(refs)
  }
}

export const formatStore = {
  get() {
    const user = auth.getCurrentUser()
    if (!user) return null
    const all = storage.get(STORAGE_KEYS.FORMAT_CONFIG) || {}
    return all[user.id] || null
  },

  save(config) {
    const user = auth.getCurrentUser()
    if (!user) return false
    const all = storage.get(STORAGE_KEYS.FORMAT_CONFIG) || {}
    all[user.id] = config
    return storage.set(STORAGE_KEYS.FORMAT_CONFIG, all)
  }
}

export const progressStore = {
  get() {
    const user = auth.getCurrentUser()
    if (!user) return null
    const all = storage.get(STORAGE_KEYS.PROGRESS) || {}
    return all[user.id] || null
  },

  save(progress) {
    const user = auth.getCurrentUser()
    if (!user) return false
    const all = storage.get(STORAGE_KEYS.PROGRESS) || {}
    all[user.id] = progress
    return storage.set(STORAGE_KEYS.PROGRESS, all)
  }
}

export const paperStore = {
  getAll() {
    const user = auth.getCurrentUser()
    if (!user) return []
    const all = storage.get(STORAGE_KEYS.PAPERS) || {}
    return all[user.id] || []
  },

  save(papers) {
    const user = auth.getCurrentUser()
    if (!user) return false
    const all = storage.get(STORAGE_KEYS.PAPERS) || {}
    all[user.id] = papers
    return storage.set(STORAGE_KEYS.PAPERS, all)
  },

  add(paper) {
    const papers = this.getAll()
    papers.unshift({ ...paper, id: Date.now(), createdAt: new Date().toISOString() })
    return this.save(papers)
  }
}
