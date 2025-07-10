import { firebaseDb, convertFirestoreDoc, convertFirestoreSnapshot } from './firebase-admin'
import { ulid } from 'ulid'
import { 
  DocumentData, 
  QueryDocumentSnapshot, 
  CollectionReference,
  DocumentReference,
  Query,
  WhereFilterOp,
  OrderByDirection,
  Timestamp
} from 'firebase-admin/firestore'

// Types for database operations
interface FindManyOptions {
  where?: Record<string, any>
  include?: Record<string, boolean | FindManyOptions>
  orderBy?: Record<string, OrderByDirection>
  skip?: number
  take?: number
}

interface FindUniqueOptions {
  where: Record<string, any>
  include?: Record<string, boolean | FindManyOptions>
}

interface CreateOptions {
  data: Record<string, any>
  include?: Record<string, boolean | FindManyOptions>
}

interface UpdateOptions {
  where: Record<string, any>
  data: Record<string, any>
  include?: Record<string, boolean | FindManyOptions>
}

interface DeleteOptions {
  where: Record<string, any>
}

// Base Firebase Database class that mimics Prisma interface
class FirebaseModel {
  constructor(private collectionName: string) {}

  private getCollection(): CollectionReference {
    return firebaseDb.collection(this.collectionName)
  }

  private buildQuery(collection: CollectionReference, options?: FindManyOptions): Query {
    let query: Query = collection

    // Apply where clauses
    if (options?.where) {
      for (const [field, value] of Object.entries(options.where)) {
        if (value !== undefined && value !== null) {
          query = query.where(field, '==', value)
        }
      }
    }

    // Apply ordering
    if (options?.orderBy) {
      for (const [field, direction] of Object.entries(options.orderBy)) {
        query = query.orderBy(field, direction)
      }
    }

    // Apply pagination
    if (options?.skip) {
      query = query.offset(options.skip)
    }
    if (options?.take) {
      query = query.limit(options.take)
    }

    return query
  }

  private async includeRelatedData(doc: any, include?: Record<string, boolean | FindManyOptions>): Promise<any> {
    if (!include || !doc) return doc

    for (const [relationName, includeOptions] of Object.entries(include)) {
      if (includeOptions === true || typeof includeOptions === 'object') {
        // Handle different relationship types
        const relationData = await this.fetchRelatedData(doc, relationName, includeOptions)
        doc[relationName] = relationData
      }
    }

    return doc
  }

  private async fetchRelatedData(doc: any, relationName: string, includeOptions: boolean | FindManyOptions): Promise<any> {
    // This will be implemented based on specific relationship patterns
    // For now, return placeholder
    return null
  }

  async findMany(options?: FindManyOptions): Promise<any[]> {
    try {
      const query = this.buildQuery(this.getCollection(), options)
      const snapshot = await query.get()
      
      let docs = convertFirestoreSnapshot(snapshot)

      // Apply includes if specified
      if (options?.include) {
        docs = await Promise.all(
          docs.map((doc: any) => this.includeRelatedData(doc, options.include))
        )
      }

      return docs
    } catch (error) {
      console.error(`Error in ${this.collectionName}.findMany:`, error)
      throw error
    }
  }

  async findUnique(options: FindUniqueOptions): Promise<any | null> {
    try {
      const { where, include } = options

      if (where.id) {
        // Direct document lookup by ID
        const doc = await this.getCollection().doc(where.id).get()
        let result = convertFirestoreDoc(doc)
        
        if (result && include) {
          result = await this.includeRelatedData(result, include)
        }
        
        return result
      } else {
        // Query-based lookup
        const query = this.buildQuery(this.getCollection(), { where })
        const snapshot = await query.limit(1).get()
        
        if (snapshot.empty) return null
        
        let result = convertFirestoreDoc(snapshot.docs[0])
        
        if (result && include) {
          result = await this.includeRelatedData(result, include)
        }
        
        return result
      }
    } catch (error) {
      console.error(`Error in ${this.collectionName}.findUnique:`, error)
      throw error
    }
  }

  async create(options: CreateOptions): Promise<any> {
    try {
      const { data, include } = options
      
      // Generate ID if not provided
      const id = data.id || ulid()
      
      // Add timestamps
      const now = Timestamp.now()
      const docData = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now
      }

      // Create document
      await this.getCollection().doc(id).set(docData)
      
      // Fetch created document
      const doc = await this.getCollection().doc(id).get()
      let result = convertFirestoreDoc(doc)
      
      if (result && include) {
        result = await this.includeRelatedData(result, include)
      }
      
      return result
    } catch (error) {
      console.error(`Error in ${this.collectionName}.create:`, error)
      throw error
    }
  }

  async update(options: UpdateOptions): Promise<any> {
    try {
      const { where, data, include } = options
      
      if (!where.id) {
        throw new Error('Update requires an id in where clause')
      }

      // Add updated timestamp
      const updateData = {
        ...data,
        updatedAt: Timestamp.now()
      }

      // Update document
      await this.getCollection().doc(where.id).update(updateData)
      
      // Fetch updated document
      const doc = await this.getCollection().doc(where.id).get()
      let result = convertFirestoreDoc(doc)
      
      if (result && include) {
        result = await this.includeRelatedData(result, include)
      }
      
      return result
    } catch (error) {
      console.error(`Error in ${this.collectionName}.update:`, error)
      throw error
    }
  }

  async delete(options: DeleteOptions): Promise<any> {
    try {
      const { where } = options
      
      if (!where.id) {
        throw new Error('Delete requires an id in where clause')
      }

      // Fetch document before deleting
      const doc = await this.getCollection().doc(where.id).get()
      const result = convertFirestoreDoc(doc)
      
      if (!result) {
        throw new Error('Document not found')
      }

      // Delete document
      await this.getCollection().doc(where.id).delete()
      
      return result
    } catch (error) {
      console.error(`Error in ${this.collectionName}.delete:`, error)
      throw error
    }
  }

  async count(options?: { where?: Record<string, any> }): Promise<number> {
    try {
      const query = this.buildQuery(this.getCollection(), { where: options?.where })
      const snapshot = await query.get()
      return snapshot.size
    } catch (error) {
      console.error(`Error in ${this.collectionName}.count:`, error)
      throw error
    }
  }
}

// Firebase database client that mimics Prisma interface
export const firebaseDbClient = {
  user: new FirebaseModel('users'),
  company: new FirebaseModel('companies'),
  contact: new FirebaseModel('contacts'),
  jobApplication: new FirebaseModel('jobApplications'),
  activity: new FirebaseModel('activities'),
  tag: new FirebaseModel('tags'),
  link: new FirebaseModel('links'),
  activityContact: new FirebaseModel('activityContacts'),
  contactTag: new FirebaseModel('contactTags'),
  companyTag: new FirebaseModel('companyTags'),
  activityTag: new FirebaseModel('activityTags'),
}

// Type-safe wrapper functions
export type FirebaseDbClient = typeof firebaseDbClient